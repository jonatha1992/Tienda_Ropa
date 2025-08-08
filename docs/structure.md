1) Estructura del repositorio

flowchart TD
  A[Repo root] --> G[.github/]
  G --> G1[copilot-instructions.md]
  G --> G2[instructions/]
  G2 --> I0[00-context-check.instructions.md]
  G2 --> I1[01-use-context.instructions.md]
  G2 --> I2[02-readme-autoupdate.instructions.md]
  G2 --> I3[04-dead-code-policy.instructions.md]

  A --> D[docs/]
  D --> D1[planning.md]
  D --> D2[structure.md]
  D --> D3[tech-stack.md]

  A --> B[backend/]
  B --> B1[app/]
  B1 --> B11[api/]
  B11 --> B12[v1/]
  B12 --> B13[endpoints/]
  B13 --> B14[items.py]
  B1 --> B3[db/session.py]
  B1 --> B4[models/user.py]
  B --> BA[alembic/]
  B --> BAI[alembic.ini]
  B1 --> B5[main.py]
  B --> BR[requirements.txt]
  B --> BD[Dockerfile]
  B --> BE[.env.example]

  A --> F[frontend/]
  F --> FS[src/]
  FS --> FSM[main.ts]
  FS --> FSA[App.vue]
  FS --> FSF[firebase.ts]
  F --> FI[index.html]
  F --> FP[package.json]
  F --> FT[tsconfig.json]
  F --> FV[vite.config.ts]
  F --> FE[.eslintrc.cjs]
  F --> FENV[.env.example]
  F --> FD[Dockerfile]

  A --> DC[docker-compose.yml]
  A --> FB[firebase.json]
  A --> FBR[.firebaserc]

2) Arquitectura (alto nivel)
  flowchart LR
  FE[Frontend: Vue 3 + TS (Firebase Hosting)]
  BE[Backend: FastAPI (Railway)]
  DB[(PostgreSQL)]
  STG[(Firebase Storage)]
  USR[Usuarios / Tienda Física]

  USR --> FE
  USR --> BE
  FE <--> BE
  BE --> DB
  FE --> STG