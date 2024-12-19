```
FillsApp/
├── src/
│   │
│   │
│   ├── components/
│   │   ├── forms/
│   │   │   ├── FormField/
│   │   │   │   ├── FormField.tsx
│   │   │   │   └── FormField.styles.ts
│   │   │   ├── FormSection/
│   │   │   │   ├── FormSection.tsx
│   │   │   │   └── FormSection.styles.ts
│   │   │   └── index.ts
│   │   └── layout/
│   │       ├── Header/
│   │       │   ├── Header.tsx
│   │       │   └── Header.styles.ts
│   │       ├── Container/
│   │       │   ├── Container.tsx
│   │       │   └── Container.styles.ts
│   │       └── index.ts
│   │
│   ├── contexts/
│   │   ├── AuthContext/
│   │   │   ├── AuthContext.tsx
│   │   │   ├── AuthProvider.tsx
│   │   │   └── types.ts
│   │   ├── ThemeContext/
│   │   │   ├── ThemeContext.tsx
│   │   │   ├── ThemeProvider.tsx
│   │   │   └── types.ts
│   │   └── FormContext/
│   │       ├── FormContext.tsx
│   │       ├── FormProvider.tsx
│   │       └── types.ts
│   │
│   ├── hooks/
│   │   ├── auth/
│   │   │   ├── useAuth.ts
│   │   │   └── useAuthState.ts
│   │   ├── forms/
│   │   │   ├── useForm.ts
│   │   │   └── useFormValidation.ts
│   │   ├── ui/
│   │   │   ├── useTheme.ts
│   │   │   └── useModal.ts
│   │   └── utils/
│   │       ├── useDebounce.ts
│   │       └── useAsync.ts
│   │
│   ├── navigation/
│   │   ├── navigators/
│   │   │   ├── AppNavigator.tsx
│   │   │   ├── AuthNavigator.tsx
│   │   │   └── FormNavigator.tsx
│   │   ├── types/
│   │   │   ├── navigation.types.ts
│   │   │   └── route.types.ts
│   │   └── utils/
│   │       └── navigationUtils.ts
│   │── screens/
│       ├── auth/
│       │   ├── Login/
│       │   │   ├── Login.tsx
│       │   │   ├── Login.styles.ts
│       │   │   └── components/
│       │   ├── Register/
│       │   │   ├── Register.tsx
│       │   │   ├── Register.styles.ts
│       │   │   └── components/
│       │   └── ForgotPassword/
│       │       ├── ForgotPassword.tsx
│       │       └── ForgotPassword.styles.ts
│       ├── forms/
│       │   ├── FormList/
│       │   │   ├── FormList.tsx
│       │   │   ├── FormList.styles.ts
│       │   │   └── components/
│       │   ├── FormEditor/
│       │   │   ├── FormEditor.tsx
│       │   │   ├── FormEditor.styles.ts
│       │   │   └── components/
│       │   └── FormPreview/
│       │       ├── FormPreview.tsx
│       │       └── FormPreview.styles.ts
│       └── profile/
│           ├── UserProfile/
│           │   ├── UserProfile.tsx
│           │   └── UserProfile.styles.ts
│           └── Settings/
│               ├── Settings.tsx
│               └── Settings.styles.ts
│    
│    
│    
├── .env.development
├── .env.production
├── .env.staging
├── .eslintrc.js
├── .prettierrc
├── .gitignore
├── app.json
├── App.tsx
├── babel.config.js
├── index.js
├── jest.config.js
├── package.json
├── README.md
├── tsconfig.json
└── yarn.lock
```