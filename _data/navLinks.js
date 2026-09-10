export default [
  { macro: "button", props: { label: "Home" }, attrs: { href: "/" }, hideInNav: true },
  {
    macro: "dropdown",
    props: {
      buttonProps: {
        label: "Pages",
        glyph: { off: "keyboard_arrow_down", on: "keyboard_arrow_up" },
        glyphPosition: "end",
      },
      position: ["left", "bottom"],
      dropdownItems: [
        { macro: "button", props: { label: "Contact" }, attrs: { href: "/contact" } },
        { macro: "button", props: { label: "Posts" }, attrs: { href: "/posts" } },
        { macro: "button", props: { label: "404" }, attrs: { href: "/404" } },
        { macro: "button", props: { label: "Success" }, attrs: { href: "/success" } },
      ],
    },
  },
  { macro: "button", props: { label: "Component documentation", type: "link" }, attrs: { href: "/components" } },
];
