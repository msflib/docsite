// MSFLib docs — library metadata, nav trees, helpers.
// Each page maps to a markdown file at /src/content/<libId>/<pageId>.md

export const libs = [
  {
    id: 'vue',
    pkg: '@msflib/vue',
    tagline: 'Vue 3 component library',
    color: '#3fb27f',
    version: 'v0.0.4',
    blurb:
      'A Vue 3 component library of business-ready UI building blocks — schema-driven forms, data tables, pickers, mapping tools and modals — built on Element Plus with FontAwesome icons.',
    chips: ['Vue 3', 'Element Plus', 'FontAwesome', '11 components'],
    nav: [
      {
        title: 'Getting started',
        items: [
          { id: 'overview', title: 'Overview' },
          { id: 'quickstart', title: 'Quickstart' },
          { id: 'theming', title: 'Theming & styles' },
        ],
      },
      {
        title: 'Form components',
        items: [
          { id: 'form-builder', title: 'FormBuilder' },
          { id: 'file-upload', title: 'FileUpload' },
          { id: 'autocomplete-input', title: 'AutoCompleteInput' },
          { id: 'date-picker', title: 'DatePicker' },
          { id: 'select-list', title: 'SelectList' },
        ],
      },
      {
        title: 'Inputs & mapping',
        items: [
          { id: 'color-picker', title: 'ColorPicker' },
          { id: 'pills-input', title: 'PillsInput' },
          { id: 'field-mapping', title: 'FieldMapping' },
        ],
      },
      {
        title: 'Data display',
        items: [
          { id: 'table-widget', title: 'TableWidget' },
          { id: 'pagination-tab', title: 'PaginationTab' },
          { id: 'status-progress', title: 'StatusProgress' },
        ],
      },
      {
        title: 'Modals & feedback',
        items: [
          { id: 'modal-dialog', title: 'ModalDialog' },
          { id: 'options-modal', title: 'OptionsModal' },
          { id: 'success-note', title: 'SuccessNote' },
        ],
      },
      {
        title: 'Reference',
        items: [{ id: 'gotchas', title: 'Gotchas & pitfalls' }],
      },
    ],
  },
  {
    id: 'react',
    pkg: '@msflib/react-*',
    tagline: 'React modules monorepo',
    color: '#38bdf8',
    version: '19 packages',
    blurb:
      'A monorepo of standalone React packages for the MSFLib platform: an application & multi-tenancy core, a full authentication module, MUI-based UI components, and 14+ feature modules wired on TanStack Query.',
    chips: ['React 18/19', 'TanStack Query', 'MUI v9', 'TypeScript'],
    nav: [
      {
        title: 'Getting started',
        items: [
          { id: 'overview', title: 'Overview' },
          { id: 'installation', title: 'Installation & setup' },
          { id: 'architecture', title: 'Architecture' },
        ],
      },
      {
        title: 'Core & shared',
        items: [
          { id: 'core', title: '@msflib/core' },
          { id: 'react-shared', title: '@msflib/react-shared' },
          { id: 'react-ux', title: '@msflib/react-ux' },
          { id: 'testing', title: '@msflib/testing' },
        ],
      },
      {
        title: 'Authentication',
        items: [{ id: 'react-auth', title: '@msflib/react-auth' }],
      },
      {
        title: 'UI components',
        items: [
          { id: 'components', title: '@msflib/react-components' },
          { id: 'component-formbuilder', title: 'FormBuilder' },
          { id: 'component-tablewidget', title: 'TableWidget' },
          { id: 'component-chatbox', title: 'ChatBox' },
          { id: 'component-treeview', title: 'TreeView' },
          { id: 'component-misc', title: 'Other components' },
        ],
      },
      {
        title: 'Feature modules',
        items: [
          { id: 'react-notification', title: 'Notifications' },
          { id: 'react-profile', title: 'Profile' },
          { id: 'react-workspace', title: 'Workspaces & tenancy' },
          { id: 'react-support', title: 'Support' },
          { id: 'react-certificate', title: 'Certificates' },
          { id: 'react-users', title: 'Users' },
          { id: 'react-categories', title: 'Categories' },
          { id: 'react-tasks', title: 'Tasks' },
          { id: 'react-students', title: 'Students' },
          { id: 'react-trainers', title: 'Trainers' },
          { id: 'react-courses', title: 'Courses' },
          { id: 'react-documents', title: 'Documents' },
          { id: 'react-drivelink', title: 'Drivelink' },
          { id: 'react-ai', title: 'AI & chat' },
        ],
      },
    ],
  },
  {
    id: 'fastapi',
    pkg: 'msflib-fastapi',
    tagline: 'Python core & feature modules',
    color: '#2fb6a8',
    version: 'core + 9 modules',
    blurb:
      'A FastAPI monorepo with a shared core library and independently installable feature modules — auth, payments, notifications, AI and more — glued by tiered configuration and a policy engine.',
    chips: ['FastAPI', 'Python', 'Pydantic', 'Modular'],
    nav: [
      {
        title: 'Getting started',
        items: [
          { id: 'overview', title: 'Overview' },
          { id: 'installation', title: 'Installation' },
          { id: 'app-template', title: 'Building an app' },
          { id: 'configuration', title: 'Tiered configuration' },
          { id: 'policy', title: 'Policy engine' },
        ],
      },
      {
        title: 'Core library',
        items: [{ id: 'core', title: 'msflib core API' }],
      },
      {
        title: 'Feature modules',
        items: [
          { id: 'module-auth', title: 'Auth' },
          { id: 'module-account', title: 'Account' },
          { id: 'module-workspaces', title: 'Workspaces' },
          { id: 'module-workspace-config', title: 'Workspace config' },
          { id: 'module-notifications', title: 'Notifications' },
          { id: 'module-workspace-notifications', title: 'Workspace notifications' },
          { id: 'module-payments', title: 'Payments' },
          { id: 'module-drivelink', title: 'DriveLink' },
          { id: 'module-ai-core', title: 'AI core' },
        ],
      },
    ],
  },
]

export const libById = Object.fromEntries(libs.map((l) => [l.id, l]))

/** Flatten a library's nav into an ordered page list. */
export function flatPages(lib) {
  const out = []
  lib.nav.forEach((group) =>
    group.items.forEach((item) =>
      out.push({ libId: lib.id, pageId: item.id, title: item.title, group: group.title })
    ),
  )
  return out
}

export function getPage(libId, pageId) {
  const lib = libById[libId]
  if (!lib) return null
  const group = lib.nav.find((g) => g.items.some((i) => i.id === pageId))
  if (!group) return null
  const page = group.items.find((i) => i.id === pageId)
  return { lib, group: group.title, page }
}

export function prevNext(lib, pageId) {
  const pages = flatPages(lib)
  const idx = pages.findIndex((p) => p.pageId === pageId)
  if (idx === -1) return { prev: null, next: null }
  return { prev: pages[idx - 1] ?? null, next: pages[idx + 1] ?? null }
}

export const firstPageOf = (libId) => libById[libId]?.nav[0]?.items[0]?.id ?? null
