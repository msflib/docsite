import type { ComponentType } from 'react'
import { libById } from './docs'

/*
 * Page registry — every docs page is a React component.
 * Search text is authored here (the content is compiled JSX, not strings).
 */
export interface PageEntry {
  libId: string
  pageId: string
  title: string
  description: string
  Component: ComponentType
  text: string
}

/* ------------------------------- VUE ------------------------------- */
import VueOverview from '../content/vue/overview'
import VueQuickstart from '../content/vue/quickstart'
import VueTheming from '../content/vue/theming'
import VueFormBuilder from '../content/vue/form-builder'
import VueFileUpload from '../content/vue/file-upload'
import VueAutoComplete from '../content/vue/autocomplete-input'
import VueDatePicker from '../content/vue/date-picker'
import VueSelectList from '../content/vue/select-list'
import VueColorPicker from '../content/vue/color-picker'
import VuePillsInput from '../content/vue/pills-input'
import VueFieldMapping from '../content/vue/field-mapping'
import VueTableWidget from '../content/vue/table-widget'
import VuePaginationTab from '../content/vue/pagination-tab'
import VueStatusProgress from '../content/vue/status-progress'
import VueModalDialog from '../content/vue/modal-dialog'
import VueOptionsModal from '../content/vue/options-modal'
import VueSuccessNote from '../content/vue/success-note'
import VueGotchas from '../content/vue/gotchas'

/* ------------------------------ REACT ------------------------------ */
import ReactOverview from '../content/react/overview'
import ReactInstallation from '../content/react/installation'
import ReactArchitecture from '../content/react/architecture'
import ReactCore from '../content/react/core'
import ReactShared from '../content/react/react-shared'
import ReactUx from '../content/react/react-ux'
import ReactTesting from '../content/react/testing'
import ReactAuth from '../content/react/react-auth'
import ReactComponents from '../content/react/components'
import ReactFormBuilder from '../content/react/component-formbuilder'
import ReactTableWidget from '../content/react/component-tablewidget'
import ReactChatBox from '../content/react/component-chatbox'
import ReactTreeView from '../content/react/component-treeview'
import ReactMisc from '../content/react/component-misc'
import ReactNotification from '../content/react/react-notification'
import ReactProfile from '../content/react/react-profile'
import ReactWorkspace from '../content/react/react-workspace'
import ReactSupport from '../content/react/react-support'
import ReactCertificate from '../content/react/react-certificate'
import ReactUsers from '../content/react/react-users'
import ReactCategories from '../content/react/react-categories'
import ReactTasks from '../content/react/react-tasks'
import ReactStudents from '../content/react/react-students'
import ReactTrainers from '../content/react/react-trainers'
import ReactCourses from '../content/react/react-courses'
import ReactDocuments from '../content/react/react-documents'
import ReactDrivelink from '../content/react/react-drivelink'
import ReactAi from '../content/react/react-ai'

/* ------------------------------ FASTAPI ---------------------------- */
import FastapiOverview from '../content/fastapi/overview'
import FastapiInstallation from '../content/fastapi/installation'
import FastapiAppTemplate from '../content/fastapi/app-template'
import FastapiConfiguration from '../content/fastapi/configuration'
import FastapiPolicy from '../content/fastapi/policy'
import FastapiCore from '../content/fastapi/core'
import FastapiAuth from '../content/fastapi/module-auth'
import FastapiAccount from '../content/fastapi/module-account'
import FastapiWorkspaces from '../content/fastapi/module-workspaces'
import FastapiWorkspaceConfig from '../content/fastapi/module-workspace-config'
import FastapiNotifications from '../content/fastapi/module-notifications'
import FastapiWorkspaceNotifications from '../content/fastapi/module-workspace-notifications'
import FastapiPayments from '../content/fastapi/module-payments'
import FastapiDrivelink from '../content/fastapi/module-drivelink'
import FastapiAiCore from '../content/fastapi/module-ai-core'

const entries: PageEntry[] = [
  // VUE
  { libId: 'vue', pageId: 'overview', title: 'Overview', description: '@msflib/vue is a Vue 3 component library of business-ready UI building blocks built on Element Plus and FontAwesome.', Component: VueOverview, text: '@msflib/vue Vue 3 Element Plus components FormBuilder TableWidget pills colorpicker fieldmapping modals status progress FontAwesome colord vite library mode named exports no plugin GitHub Packages vue 3.4 defineModel' },
  { libId: 'vue', pageId: 'quickstart', title: 'Quickstart', description: 'Install @msflib/vue, wire up Element Plus and FontAwesome, and render your first component.', Component: VueQuickstart, text: 'install npm GitHub Packages .npmrc registry token element-plus css font awesome app.use main.js vc-assets postinstall photo.png confetti requirements checklist' },
  { libId: 'vue', pageId: 'theming', title: 'Theming & styles', description: 'How @msflib/vue styling works — Element Plus CSS, Tailwind utilities, custom theme classes and the default color palette.', Component: VueTheming, text: 'styles css tailwind utilities bg-pri text-pri theme classes element plus dark mode color palette defaultColorPalette style.css export' },
  { libId: 'vue', pageId: 'form-builder', title: 'FormBuilder', description: 'Render complete, validated Vue forms from a plain array of field descriptors.', Component: VueFormBuilder, text: 'FormBuilder elements schema dtype etype name label placeholder width class startIcon endIcon disabled mdata events rules validation dot-path nested el-form triggerValidation props events exposed submit btnClicked' },
  { libId: 'vue', pageId: 'file-upload', title: 'FileUpload', description: 'Element Plus powered upload box with drag & drop, preview and per-file validation.', Component: VueFileUpload, text: 'FileUpload upload drag drop preview maxFileSize validator promptText fileTypes triggerElementType clearFiles removeUploadedFile testUpload mdata validation' },
  { libId: 'vue', pageId: 'autocomplete-input', title: 'AutoCompleteInput', description: 'Text input with client-side filtering or async search callbacks.', Component: VueAutoComplete, text: 'AutoCompleteInput autocomplete items searchCallback suggestions select input el-autocomplete' },
  { libId: 'vue', pageId: 'date-picker', title: 'DatePicker', description: 'Element Plus date picker passthrough with sensible defaults.', Component: VueDatePicker, text: 'DatePicker date format valueFormat placeholder type datetime' },
  { libId: 'vue', pageId: 'select-list', title: 'SelectList', description: 'el-select dropdown wrapper with object-value support.', Component: VueSelectList, text: 'SelectList select options valueKey label dropdown el-select' },
  { libId: 'vue', pageId: 'color-picker', title: 'ColorPicker', description: 'Swatch grid plus custom color selection.', Component: VueColorPicker, text: 'ColorPicker colorPalette swatches palette rgb custom picker alpha el-color-picker' },
  { libId: 'vue', pageId: 'pills-input', title: 'PillsInput', description: 'Tag editor with colored pills and contrast-aware foreground colors.', Component: VuePillsInput, text: 'PillsInput pills tags withColor useRelatedForeColor colord contrast itemSelected inputPlaceholder' },
  { libId: 'vue', pageId: 'field-mapping', title: 'FieldMapping', description: 'Map CSV columns to target fields with a two-column mapper UI.', Component: VueFieldMapping, text: 'FieldMapping csv columns inputFields targetFields headerBgColor mapping import spreadsheet' },
  { libId: 'vue', pageId: 'table-widget', title: 'TableWidget', description: 'Data table with selection, search, sorting, row menus and built-in pagination.', Component: VueTableWidget, text: 'TableWidget table el-table selection selectedRows selectedData checkbox sortable menuItems include exclude columnOrder headerMap filterText pageSizes cellPrerender status image cells pagination row-clicked menu-item-clicked' },
  { libId: 'vue', pageId: 'pagination-tab', title: 'PaginationTab', description: '"Show rows" selector plus pager bar — the footer used by TableWidget.', Component: VuePaginationTab, text: 'PaginationTab pagination total pageSizes currentPage pageSize pageChange sizeChange show rows' },
  { libId: 'vue', pageId: 'status-progress', title: 'StatusProgress', description: 'Ordered status stepper with colored segments and check badges.', Component: VueStatusProgress, text: 'StatusProgress stepper status list order currentStatus disabledStatusColor progress steps' },
  { libId: 'vue', pageId: 'modal-dialog', title: 'ModalDialog', description: 'el-dialog wrapper with optional Cancel/Confirm footer.', Component: VueModalDialog, text: 'ModalDialog dialog modal size title footer modalClosed update:modelValue el-dialog' },
  { libId: 'vue', pageId: 'options-modal', title: 'OptionsModal', description: 'Full-screen question prompt with primary and secondary actions.', Component: VueOptionsModal, text: 'OptionsModal question primaryBtnText secondaryBtnText priBtnClicked secBtnClicked confirm' },
  { libId: 'vue', pageId: 'success-note', title: 'SuccessNote', description: 'Confetti success screen with a primary action and optional secondary link.', Component: VueSuccessNote, text: 'SuccessNote success confetti primaryBtnClicked secondaryBtnClicked nuxt-link link linkText' },
  { libId: 'vue', pageId: 'gotchas', title: 'Gotchas & pitfalls', description: 'Known quirks, version requirements and legacy surface in @msflib/vue — read before integrating.', Component: VueGotchas, text: 'gotchas pitfalls quirks vue 3.4 defineModel dead code style.css missing vc-assets mutation prop mutate legacy inert props events registry scope' },

  // REACT
  { libId: 'react', pageId: 'overview', title: 'Overview', description: 'msflib-react is a pnpm monorepo of standalone, published React packages for the MSFLib platform.', Component: ReactOverview, text: 'msflib-react monorepo pnpm packages @msflib scope GitHub Packages tsup TanStack Query MUI react 18 19 providers configureApplication playground changesets versions' },
  { libId: 'react', pageId: 'installation', title: 'Installation & setup', description: 'Install @msflib packages from GitHub Packages, wire providers, and configure the application core.', Component: ReactInstallation, text: 'installation npmrc registry token peer dependencies react-hook-form @msflib/typescript configureApplication endpoints Providers QueryClientProvider tailwind prerequisites' },
  { libId: 'react', pageId: 'architecture', title: 'Architecture', description: 'How msflib-react is structured — the data-module pattern, workspace scoping and build tooling.', Component: ReactArchitecture, text: 'architecture workspace layout packages apps configs scripts data module pattern createXApi XProvider useX queryKeys endpoint defaults workspace scoping path header decorators vitest jest storybook testing' },
  { libId: 'react', pageId: 'core', title: '@msflib/core', description: 'Framework-agnostic application core — configuration, storage, the API client and workspace tenancy.', Component: ReactCore, text: '@msflib/core configureApplication getApplicationConfig storage createStorage setActiveWorkspace subscribeActiveWorkspace configuredApiClient apiClient loginClient apiFormDataClient dispatchBrowserEvent workspace scoped endpoints registry resetApplicationConfig SSR' },
  { libId: 'react', pageId: 'react-shared', title: '@msflib/react-shared', description: 'Shared React utilities used by every data module — active workspace sync and safe mutation callbacks.', Component: ReactShared, text: 'react-shared useActiveWorkspace useSyncExternalStore createCallbackHandler MutateOptions onSuccess onError mutateAsync' },
  { libId: 'react', pageId: 'react-ux', title: '@msflib/react-ux', description: 'UI-agnostic interaction utilities — file-explorer logic, outside-click handling and lazy tree data.', Component: ReactUx, text: 'react-ux file explorer buildExplorerRows useExplorerRowClick buildExplorerIcon normalizeExplorerPath joinExplorerPath useCloseOnOutsideInteraction useLazyTreeData tree view lazy loading adapter fetchChildren buildLazyTreeItems' },
  { libId: 'react', pageId: 'testing', title: '@msflib/testing', description: 'Shared Vitest configs and mock factories for testing @msflib modules.', Component: ReactTesting, text: 'testing vitest config createJsdomConfig createNodeConfig createHoisedMocks createMockStorage createMockCoreConfig test-setup jest-dom vi.hoisted' },
  { libId: 'react', pageId: 'react-auth', title: '@msflib/react-auth', description: 'Complete auth flows — login, registration, OTP, SSO, password recovery — plus session state.', Component: ReactAuth, text: 'react-auth AuthProvider useAuth status me login register recoverPassword verifyToken resetPassword resendCode verifyAvailability authenticate verifyOtp ssoLogin ssoRedirect ssoRetrieve logout updateMe loading endpoints DEFAULT_ENDPOINTS isWorkspaceScoped query keys' },
  { libId: 'react', pageId: 'components', title: '@msflib/react-components', description: 'The MUI-based UI kit — FormBuilder, TableWidget, ChatBox, TreeView, skeletons and more.', Component: ReactComponents, text: 'react-components MUI v9 emotion react-hook-form dnd-kit react-icons storybook component map index FormElement skeleton AppSkeleton tailwind' },
  { libId: 'react', pageId: 'component-formbuilder', title: 'FormBuilder (React)', description: 'Declarative, validated forms from an element array — powered by react-hook-form.', Component: ReactFormBuilder, text: 'FormBuilder FormElement eType dType validation mData options startIcon endIcon clickBehavior loadingState layout FormField resetFormOnSubmit password toggle login playground example' },
  { libId: 'react', pageId: 'component-tablewidget', title: 'TableWidget (React)', description: 'MUI X DataGrid wrapper with search, row menus, checkbox selection and draggable rows.', Component: ReactTableWidget, text: 'TableWidget DataGrid rows columns pageSize pageSizeOptions tableTitle enableSearch checkboxSelection onRowClick onRowSelectionModelChange menuItems handleMenuClick styles autoHeight draggable onRowsReorder avatar processedColumns' },
  { libId: 'react', pageId: 'component-chatbox', title: 'ChatBox', description: 'Controlled chat UI with markdown rendering, uploads, suggestions and feedback actions.', Component: ReactChatBox, text: 'ChatBox chat messages role onSend onChange onUpload onSuggestionClick onFeedback allowFeedback feedbackActions roleMap disableMarkdown markdown autoScroll adapters transcriptToChatMessages nativeResponseToChatMessages renderMessage' },
  { libId: 'react', pageId: 'component-treeview', title: 'TreeView', description: 'WAI-ARIA compliant tree view with lazy loading — the MIT-licensed alternative to MUI X RichTreeView.', Component: ReactTreeView, text: 'TreeView tree items expandedItems selectedItems multiSelect isItemLoading getItemId getItemLabel isItemExpandable indentSize keyboard WAI-ARIA RichTreeView pro flattenVisibleItems icons' },
  { libId: 'react', pageId: 'component-misc', title: 'Other components', description: 'DraggableList, CustomSvg, Google auth, skeletons and ResizablePane.', Component: ReactMisc, text: 'DraggableList dnd-kit onDragEnd renderItem CustomSvg svg currentColor GoogleAuthButton useGoogleCallback GoogleAuthHandler google login redirect skeleton AppSkeleton SkeletonLoaderWrapper SkeletonCardLayout ResizablePane panes minSize maxSize' },
  { libId: 'react', pageId: 'react-notification', title: 'Notifications', description: '@msflib/react-notification — account notification list with read-state mutations.', Component: ReactNotification, text: 'react-notification NotificationProvider useNotification notifications toggleStatus toggleAllStatus removeNotification loading mark read unread' },
  { libId: 'react', pageId: 'react-profile', title: 'Profile', description: '@msflib/react-profile — profile CRUD and avatar upload.', Component: ReactProfile, text: 'react-profile ProfileProvider useProfile profile updateProfile uploadAvatar refetch loading avatar FormData' },
  { libId: 'react', pageId: 'react-workspace', title: 'Workspaces & tenancy', description: '@msflib/react-workspace — workspace CRUD, tenant switching and the multi-tenancy decorators.', Component: ReactWorkspace, text: 'react-workspace WorkspaceProvider useWorkspace useGetWorkspace createWorkspace updateWorkspace deleteWorkspace availableWorkspaces tenant switcher workspaceHookDecorator PathBasedDecorator HeaderBasedDecorator X-Workspace slug setActiveWorkspace' },
  { libId: 'react', pageId: 'react-support', title: 'Support', description: '@msflib/react-support — support ticket listing and creation.', Component: ReactSupport, text: 'react-support SupportProvider useSupport supportIssues getSupportIssue createSupportIssue tickets' },
  { libId: 'react', pageId: 'react-certificate', title: 'Certificates', description: '@msflib/react-certificate — user certificates and the admin certificate builder config.', Component: ReactCertificate, text: 'react-certificate CertificateProvider useCertificate myCertificate configs fieldNames fonts users generateCertificate preview admin' },
  { libId: 'react', pageId: 'react-users', title: 'Users', description: '@msflib/react-users — user directory, single user fetch and workspace membership.', Component: ReactUsers, text: 'react-users UsersProvider useUsers users getUser joinWorkspace user me directory membership' },
  { libId: 'react', pageId: 'react-categories', title: 'Categories', description: '@msflib/react-categories — typed category lists for any categoryType.', Component: ReactCategories, text: 'react-categories CategoryProvider useCategories useCategory createCategoryApi categoryType cat workspace scoped' },
  { libId: 'react', pageId: 'react-tasks', title: 'Tasks', description: '@msflib/react-tasks — LMS tasks, submissions and admin promotions/demotions.', Component: ReactTasks, text: 'react-tasks TasksProvider useTasks tasks submissions getTask promote demote admin promotions demotions LMS' },
  { libId: 'react', pageId: 'react-students', title: 'Students', description: '@msflib/react-students — LMS student directory.', Component: ReactStudents, text: 'react-students StudentsProvider useStudents students getStudent refetch LMS roster' },
  { libId: 'react', pageId: 'react-trainers', title: 'Trainers', description: '@msflib/react-trainers — LMS trainer directory (unreleased).', Component: ReactTrainers, text: 'react-trainers TrainersProvider useTrainers trainers getTrainer refetch unreleased 0.0.0' },
  { libId: 'react', pageId: 'react-courses', title: 'Courses', description: '@msflib/react-courses — courses, enrollment, topics and progress (unreleased).', Component: ReactCourses, text: 'react-courses CoursesProvider useCourses courses listMine enroll topics topic items progress unreleased LMS' },
  { libId: 'react', pageId: 'react-documents', title: 'Documents', description: '@msflib/react-documents — document list, upload, download, worker runs and ingestion status.', Component: ReactDocuments, text: 'react-documents DocumentsProvider useDocuments documents upload download runWorker reindex ingestionStatus ingestionJobs downloadBlob blob worker' },
  { libId: 'react', pageId: 'react-drivelink', title: 'Drivelink', description: '@msflib/react-drivelink — Drive-style file nodes with search, trash, starring, recents and batch ops.', Component: ReactDrivelink, text: 'react-drivelink DrivelinkProvider useDrivelink health listNodes searchNodes folders downloadNode trashNodes starredNodes recentNodes batch downloadBlob tree' },
  { libId: 'react', pageId: 'react-ai', title: 'AI & chat', description: '@msflib/react-ai — LLM and agent chat with streaming, search and protocol selection (unreleased).', Component: ReactAi, text: 'react-ai AiProvider useLlm useAgent getStatus getProtocols search ask askStream fetchAskStream llm agent streaming protocols unreleased ChatBox' },

  // FASTAPI
  { libId: 'fastapi', pageId: 'overview', title: 'Overview', description: 'msflib-fastapi is a FastAPI monorepo: a shared core library plus independently installable feature modules.', Component: FastapiOverview, text: 'msflib-fastapi monorepo poetry core modules account auth workspaces workspace_config notifications payments drivelink ai_core pydantic v2 fastapi 0.111 python 3.10 alembic repository layout' },
  { libId: 'fastapi', pageId: 'installation', title: 'Installation', description: 'Install the msflib core and feature modules via Poetry/Pip git references.', Component: FastapiInstallation, text: 'installation poetry pip git subdirectory rev extras email sms all openai pgvector dependency chains conftest sys.path' },
  { libId: 'fastapi', pageId: 'app-template', title: 'Building an app', description: 'Compose core + modules into a running FastAPI application — the testsite pattern.', Component: FastapiAppTemplate, text: 'settings TestSiteSettings mixin compose_settings_model get_session_factory api_router include_router dependencies get_account_dependencies get_user_dependencies seed init_db SeedRunner scaffold template with_workspaces app.core.config' },
  { libId: 'fastapi', pageId: 'configuration', title: 'Tiered configuration', description: 'default → environment → tenant → workspace → user → request: the layered settings engine.', Component: FastapiConfiguration, text: 'tiered configuration precedence default environment tenant workspace user request override ModuleSettingsBase SettingsBase scope namespace merge_config_layers normalize_request_override validate_request_override_allowlist flat_aliases env nested delimiter' },
  { libId: 'fastapi', pageId: 'policy', title: 'Policy engine', description: 'PolicyEnvelope, PolicyResolutionService, traces and decision records — explicit, auditable policy resolution.', Component: FastapiPolicy, text: 'policy PolicyEnvelope PolicyResolutionService PolicyResolutionTrace winning_layers rejected_overrides PolicyDecisionRecord PolicyChangeRecord PolicyScopedConfigStore validate_policy_mapping PolicyLayer envelope observability audit' },
  { libId: 'fastapi', pageId: 'core', title: 'msflib core API', description: 'The shared foundation — models, CRUD actions, eventbus, security, stores, seeders and services.', Component: FastapiCore, text: 'core SchemaBase ModelBase BaseEnum ServerEvent ModelAction action eventbus Emitter listen security create_access_token verify_password revoke_access_token MapStore RedisStore keystore Token Msg send_email DependencyNamespace get_session_factory create_enhanced_router SeederBase ActionSeeder SeedRunner uploads LocalStorage AWSStorage Cloudinary slugify init_db' },
  { libId: 'fastapi', pageId: 'module-auth', title: 'Auth', description: 'msflib-auth — JWT login, token revocation, password recovery, Google OAuth and auth dependency factories.', Component: FastapiAuth, text: 'auth login google oauth callback password recovery verify reset logout Token GoogleUserInfo dependencies get_account_dependencies get_user_dependencies RoleCheck WorkspaceRoleCheck PathParameterResolver HttpHeaderResolver authlib' },
  { libId: 'fastapi', pageId: 'module-account', title: 'Account', description: 'msflib-account — accounts, profiles, open registration and admin management.', Component: FastapiAccount, text: 'account profile open registration admin accounts verify-availability avatar AccountCreate AccountUpdate ProfileBase AccountAction authenticate ensure_unique_fields events account-created' },
  { libId: 'fastapi', pageId: 'module-workspaces', title: 'Workspaces', description: 'msflib-workspaces — workspace lifecycle, membership, tenancy models and workspace-aware profiles.', Component: FastapiWorkspaces, text: 'workspaces membership users join switch UserType owner admin member guest WorkspaceStatus slug WorkspaceAction UserAction MembershipTypeResolver auto create default workspace register_hooks' },
  { libId: 'fastapi', pageId: 'module-workspace-config', title: 'Workspace config', description: 'msflib-workspace-config — persisted tenant/workspace/user config values powering the config tiers.', Component: FastapiWorkspaceConfig, text: 'workspace_config ScopedConfigEntry ConfigScopeType ScopedConfigService get_namespace_values put_namespace_values set_value delete_value ScopedConfigPolicyStoreAdapter categories tags health' },
  { libId: 'fastapi', pageId: 'module-notifications', title: 'Notifications', description: 'msflib-notifications — multi-channel (in-app, email, SMS) notifications with inbox and admin broadcast.', Component: FastapiNotifications, text: 'notifications channels inapp push email sms discord NotificationDispatcher NotificationHandlerFactory dispatch_account_notifications twilio admin broadcast mark read AccountNotification NotificationChannel' },
  { libId: 'fastapi', pageId: 'module-workspace-notifications', title: 'Workspace notifications', description: 'msflib-workspace-notifications — workspace-scoped notifications with Discord channel support.', Component: FastapiWorkspaceNotifications, text: 'workspace notifications discord channel bot token UserNotification DiscordChannel admin send user notifications mark-all' },
  { libId: 'fastapi', pageId: 'module-payments', title: 'Payments', description: 'msflib-payments — Stripe/Paystack payment initiation, verification and queue-driven fulfillment.', Component: FastapiPayments, text: 'payments stripe paystack gateway initiate verify reference PaymentProcessor process_payment PaymentQueue event_key fulfillment PaymentStatus PaymentError PaymentConnectionError PaymentAmountError' },
  { libId: 'fastapi', pageId: 'module-drivelink', title: 'DriveLink', description: 'msflib-drivelink — a virtual filesystem with folders, uploads, trash, search, starring and quotas.', Component: FastapiDrivelink, text: 'drivelink nodes folders files upload download copy restore trash starred recents batch DrivelinkNode checksum quota mime prefixes DrivelinkAction DrivelinkService version' },
  { libId: 'fastapi', pageId: 'module-ai-core', title: 'AI core', description: 'msflib-ai-core — provider-agnostic LLM infrastructure, LangGraph integration, ingestion and rate limiting.', Component: FastapiAiCore, text: 'ai_core LLM provider openai anthropic azure ollama bedrock openrouter groq embeddings pgvector vector store LangChainConfigBridge PromptRegistryService IngestionPipeline CheckpointScope MemoryStoreScope langgraph checkpointer RateLimiter token budget similarity_search_scoped chunking middleware policy' },
]

export const pageRegistry: Record<string, PageEntry> = Object.fromEntries(
  entries.map((e) => [`${e.libId}/${e.pageId}`, e]),
)

export function getPageEntry(libId: string, pageId: string): PageEntry | undefined {
  return pageRegistry[`${libId}/${pageId}`]
}
