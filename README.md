# upliance.ai React + Redux Form Builder

## Tech
- React + TypeScript + Vite
- Redux Toolkit
- Material UI
- localStorage persistence (no backend)

## Scripts
```bash
npm install
npm run dev      # start locally
npm run build    # production build
npm run preview  # preview built app
```

## Routes
- `/create` – build a form by adding fields, validations, and derived fields
- `/preview` – interact with the current draft form (or `/preview/:id` for a saved form)
- `/myforms` – list all saved forms from localStorage

## Derived fields
- Choose parent fields and write a JS expression using parent **IDs** or **labels** (spaces become `_`).
- Example: compute `Age` from `dob`:
  ```
  Math.floor((Date.now() - new Date(dob).getTime()) / (365.25*24*3600*1000))
  ```

## Validation supported
- Required
- Min/Max length
- Email format
- Custom password rule (≥ 8 chars and includes a number)

## Notes
- Only schema/config is stored; user input values are not persisted.
- This is a clean, modular baseline meant to be easy to extend.