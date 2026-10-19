# Combine several Mixamo FBX downloads of the same rigged scan into one GLB:
# one textured mesh + one armature, each clip exported as its own glTF animation
# (clip names must match the `name`s in components/ScanFigure.tsx).
#
# Build public/models/pablo-moves.glb:
#   D=~/Dropbox/XR-Brooklyn-2026-bnydco2610010047/3d
#   blender -b --factory-startup -P scripts/mixamo-combine.py -- \
#     "$D/obj/model_u0_v0_diffuse.jpg" /tmp/pablo-moves-raw.glb \
#     "pacing=$D/Talking Phone Pacing.fbx" "dancing=$HOME/Downloads/Dancing.fbx" \
#     "typing=$HOME/Downloads/Typing.fbx" "laying=$HOME/Downloads/Male Laying Pose.fbx"
#   npx @gltf-transform/cli@4 optimize /tmp/pablo-moves-raw.glb public/models/pablo-moves.glb \
#     --compress meshopt --texture-compress webp --texture-size 2048 \
#     --simplify-ratio 0.6 --simplify-error 0.0005
import bpy, sys
args = sys.argv[sys.argv.index('--') + 1:]
tex, out, clips = args[0], args[1], [a.split('=', 1) for a in args[2:]]
bpy.ops.wm.read_factory_settings(use_empty=True)

def fcurves(action):
    if hasattr(action, 'fcurves'):
        return list(action.fcurves)
    return [fc for layer in action.layers for strip in layer.strips for bag in strip.channelbags for fc in bag.fcurves]

def pin_hips(action):
    # In place, centred: pin the hips' horizontal travel (bone-local X and Z), keep the vertical (Y)
    for fc in fcurves(action):
        if fc.data_path == 'pose.bones["mixamorig:Hips"].location' and fc.array_index in (0, 2):
            for kp in fc.keyframe_points:
                kp.co[1] = kp.handle_left[1] = kp.handle_right[1] = 0.0
            fc.update()

arm = mesh = None
actions = []
for name, path in clips:
    before = set(bpy.data.objects)
    bpy.ops.import_scene.fbx(filepath=path)
    new = [o for o in bpy.data.objects if o not in before]
    new_arm = next(o for o in new if o.type == 'ARMATURE')
    action = new_arm.animation_data.action
    action.name = name
    action.use_fake_user = True
    pin_hips(action)
    actions.append(action)
    if arm is None:
        arm, mesh = new_arm, next(o for o in new if o.type == 'MESH')
    else:
        new_arm.animation_data.action = None
        bpy.data.batch_remove(new)

# Mixamo treated the metre-scale scan as centimetres; undo the 0.01 armature scale
arm.scale = (1, 1, 1)
arm.name, mesh.name = 'Armature', 'Pablo'

# Put the scan's photo texture back on through the UV map Mixamo preserved
img = bpy.data.images.load(tex)
mat = bpy.data.materials.new('PabloScan')
mat.use_nodes = True
nt = mat.node_tree
bsdf = nt.nodes['Principled BSDF']
node = nt.nodes.new('ShaderNodeTexImage')
node.image = img
nt.links.new(node.outputs['Color'], bsdf.inputs['Base Color'])
bsdf.inputs['Roughness'].default_value = 1.0
mesh.data.materials.clear()
mesh.data.materials.append(mat)

# One NLA track per clip so the exporter writes each as a separate animation
ad = arm.animation_data
ad.action = None
for action in actions:
    track = ad.nla_tracks.new()
    track.name = action.name
    start = int(action.frame_range[0])
    strip = track.strips.new(action.name, start, action)
    if hasattr(strip, 'action_slot') and action.slots:
        strip.action_slot = action.slots[0]
    track.mute = False
    print('clip', action.name, tuple(int(v) for v in action.frame_range))

bpy.context.scene.frame_set(1)
bpy.ops.export_scene.gltf(
    filepath=out,
    export_format='GLB',
    export_animations=True,
    export_animation_mode='NLA_TRACKS',
    export_force_sampling=True,
    export_skins=True,
    export_morph=False,
    export_cameras=False,
    export_lights=False,
)
print('exported', out)
