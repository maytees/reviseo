# Reviseo UI conventions

## Setup

No provider wrapper is required. Design tokens ship via `styles.css` (light theme on `:root`, dark on `.dark`). `Tooltip` bundles its own provider — use it directly. Fonts load from Google Fonts via `styles.css`: **Inter** (`font-sans`, the default), **Caudex** (`font-serif`, marketing headlines), **JetBrains Mono** (`font-mono`).

## Styling idiom: Tailwind v4 utilities + semantic tokens

Style layout glue with Tailwind classes using the theme's semantic color tokens — never raw hex/oklch values:

| Family | Tokens |
|---|---|
| Surfaces | `bg-background` (warm gray page), `bg-card` (white panels), `bg-popover`, `bg-muted`, `bg-secondary`, `bg-accent` |
| Text | `text-foreground`, `text-muted-foreground`, `text-secondary-foreground`, `text-accent-foreground` |
| Brand | `bg-primary` / `text-primary` / `text-primary-foreground` (violet), `ring-ring` |
| Status | `bg-destructive`, `text-destructive`, `border-input`, `border-border` |
| Radius | `rounded-md` (controls), `rounded-xl` (cards; `--radius: 0.75rem`) |
| Type | `text-sm` body, `text-xs` metadata, `font-medium` labels |

Spacing uses the default 0.25rem scale (`gap-3`, `p-5`, `space-y-1.5` are the house rhythm).

## Component API pattern

Every component is a named export on the bundle; compounds compose via subcomponents, not props:

- `Card` > `CardHeader` (`CardTitle` + `CardDescription`) > `CardContent` > `CardFooter`
- `Dialog open` > `DialogContent` > `DialogHeader`/`DialogBody`/`DialogFooter` (same shape for `AlertDialog`)
- `Select` > `SelectTrigger` (`SelectValue`) + `SelectContent` > `SelectItem`
- `Alert variant appearance` > `AlertIcon` + `AlertContent` (`AlertTitle` + `AlertDescription`)
- `Table` > `TableHeader`/`TableBody` > `TableRow` > `TableHead`/`TableCell`

Key variant axes (CVA props):
- **Button**: `variant` primary | secondary | outline | dashed | ghost | mono | destructive | link | dim; `size` lg | md | sm | icon
- **Badge**: `variant` primary | secondary | success | warning | info | info2 | destructive | outline; `appearance` default | light | outline | ghost; `size` lg | md | sm | xs — status chips use `appearance="light"`
- **Alert**: same variant family; `appearance` solid | light
- **Input**: `variant` lg | md | sm; invalid state via `aria-invalid`
- **Switch**: `size` sm | md | lg | xl; `shape` pill | square

## Where the truth lives

Read `styles.css` (imports `_ds_bundle.css` — full compiled utilities + tokens) before inventing a class. Per-component usage: `components/<group>/<Name>/<Name>.prompt.md`; exact props: `<Name>.d.ts`.

## Idiomatic example

```tsx
<Card className="w-95">
  <CardHeader>
    <CardTitle>voltrush.com</CardTitle>
    <CardDescription>Feedback activity for the last 7 days</CardDescription>
  </CardHeader>
  <CardContent className="space-y-3">
    <div className="flex items-center justify-between text-sm">
      <span>Awaiting approval</span>
      <Badge variant="warning" appearance="light">3</Badge>
    </div>
  </CardContent>
  <CardFooter className="justify-end gap-2">
    <Button variant="outline" size="sm">Open dashboard</Button>
  </CardFooter>
</Card>
```
