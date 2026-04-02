# SwagDemo Playwright Test Suite

Automated Playwright coverage for the SwagDemo checkout flow, aligned to the requested happy path, negative validation, consistency, and optional robustness scenarios.
## Scope covered

- successful order placement with one product
- successful order placement with multiple products
- checkout validation for missing first name, last name, and postal code
- cart consistency before checkout
- order summary validation for item, price, tax, and total
- order completion confirmation
- optional remove-from-cart and logout/session checks
- authentication coverage for the accepted SwagDemo usernames

## Test scenarios included

### Scenarii happy path
1. successful order placement with one product
2. successful order placement with multiple products

### Scenarii esentiale negative / validation
3. checkout fails when first name is missing
4. checkout fails when last name is missing
5. checkout fails when postal code is missing

### Scenarii importante de consistenta
6. cart preserves selected product before checkout
7. order summary displays correct item / price / total
8. user can finish order and see confirmation page

### Optional solid coverage
9. remove product from cart before checkout
10. logout does not break cart/session expectations

### Authentication coverage
11. accepted user `standard_user` can log in
12. accepted user `problem_user` can log in
13. accepted user `performance_glitch_user` can log in
14. accepted user `error_user` can log in
15. accepted user `visual_user` can log in
16. `locked_out_user` cannot log in

## Test data

Accepted usernames:

- `standard_user`
- `locked_out_user`
- `problem_user`
- `performance_glitch_user`
- `error_user`
- `visual_user`

Password for all users:

- `secret_sauce`

## Tech stack

- Playwright Test
- TypeScript
- Node.js

## Setup

```bash
npm install
npx playwright install
```

## Run tests

```bash
npm test
```

## Run headed

```bash
npm run test:headed
```

## Open HTML report

```bash
npm run report
```

## Notes / design choices

- `data-test` selectors are used where possible for better stability.
- The project uses a light Page Object Model to keep tests readable and maintainable.
- Test data is centralized in `utils/testData.ts`.
- Helpful utilities such as cart badge assertions are separated into reusable helpers.
- Failure diagnostics are enabled through screenshots, video, and trace on retry.

## Possible next improvements

- run in CI with GitHub Actions
- add smoke/regression tagging
- support multi-browser execution
- add API mocking where useful
- externalize environment configuration further
