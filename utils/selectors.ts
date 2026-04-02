export function toCartButtonId(productName: string): string {
  return `add-to-cart-${slugify(productName)}`;
}

export function toRemoveButtonId(productName: string): string {
  return `remove-${slugify(productName)}`;
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/ /g, '-');
}
