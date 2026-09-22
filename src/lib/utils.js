export const cn = (...classes) => classes.filter(Boolean).join(" ");
export const money = (value) => `£${Number(value).toFixed(0)}`;
export const imageFallback = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80";
