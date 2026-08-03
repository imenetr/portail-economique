import type { CollectionConfig } from 'payload'

export const Results: CollectionConfig = {
  slug: 'results',

  admin: {
    useAsTitle: 'title',
  },

  fields: [
    {
      name: 'title',
      label: 'Titre du résultat',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
    },
    {
  name: 'recommendations',
  label: 'Recommandations',
  type: 'relationship',
  relationTo: 'recommendations',
  hasMany: true,
},
{
  name: 'pdfResource',
  label: 'Ressource PDF',
  type: 'group',
  fields: [
    {
      name: 'label',
      label: 'Libellé',
      type: 'text',
    },
    {
      name: 'buttonText',
      label: 'Texte du bouton',
      type: 'text',
    },
    {
      name: 'file',
      label: 'Fichier PDF',
      type: 'upload',
      relationTo: 'media',
    },
  ],
},
{
  name: 'externalResourcesIntro',
  label: 'Introduction des ressources externes',
  type: 'textarea',
},
{
  name: 'externalResources',
  label: 'Ressources externes',
  type: 'array',
  fields: [
    {
      name: 'title',
      label: 'Titre',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
    },
    {
      name: 'url',
      label: 'Lien',
      type: 'text',
      required: true,
    },
  ],
},
  ],
}