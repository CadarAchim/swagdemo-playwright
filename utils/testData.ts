export const users = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce'
  },
  lockedOut: {
    username: 'locked_out_user',
    password: 'secret_sauce'
  },
  problem: {
    username: 'problem_user',
    password: 'secret_sauce'
  },
  performanceGlitch: {
    username: 'performance_glitch_user',
    password: 'secret_sauce'
  },
  error: {
    username: 'error_user',
    password: 'secret_sauce'
  },
  visual: {
    username: 'visual_user',
    password: 'secret_sauce'
  }
};

export const customer = {
  valid: {
    firstName: 'Achim',
    lastName: 'Cadar',
    postalCode: '010101'
  },
  missingFirstName: {
    firstName: '',
    lastName: 'Cadar',
    postalCode: '010101'
  },
  missingLastName: {
    firstName: 'Achim',
    lastName: '',
    postalCode: '010101'
  },
  missingPostalCode: {
    firstName: 'Achim',
    lastName: 'Cadar',
    postalCode: ''
  }
};

export const products = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltShirt: 'Sauce Labs Bolt T-Shirt'
};

export const productPrices = {
  backpack: '$29.99',
  bikeLight: '$9.99'
};

export const checkoutTotals = {
  backpackOnly: {
    itemTotal: 'Item total: $29.99',
    tax: 'Tax: $2.40',
    total: 'Total: $32.39'
  },
  backpackAndBikeLight: {
    itemTotal: 'Item total: $39.98',
    tax: 'Tax: $3.20',
    total: 'Total: $43.18'
  }
};

export const checkoutMessages = {
  successHeader: 'Thank you for your order!',
  successBody: 'Your order has been dispatched, and will arrive just as fast as the pony can get there!',
  firstNameRequired: 'Error: First Name is required',
  lastNameRequired: 'Error: Last Name is required',
  postalCodeRequired: 'Error: Postal Code is required',
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.'
};
