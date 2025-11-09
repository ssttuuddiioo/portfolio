import { DocumentActionComponent } from 'sanity'
import { CopyIcon } from '@sanity/icons'

export const duplicateAction: DocumentActionComponent = (props) => {
  const { draft, published, onComplete } = props

  return {
    label: 'Duplicate',
    icon: CopyIcon,
    onHandle: async () => {
      const doc = draft || published
      if (!doc) return

      // Create a new document with the same content but new ID
      const { _id, _rev, _type, _createdAt, _updatedAt, ...docWithoutSystemFields } = doc

      const newDoc = {
        ...docWithoutSystemFields,
        _type,
        // Add suffix to title if it exists
        ...(docWithoutSystemFields.title && {
          title: `${docWithoutSystemFields.title} (Copy)`,
        }),
      }

      // Create the new document
      await props.getClient().create(newDoc)

      onComplete()
    },
  }
}

