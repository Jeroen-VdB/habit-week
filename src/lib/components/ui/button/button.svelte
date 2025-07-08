<script lang="ts">
	import type { Snippet } from "svelte";
	import { Button as ButtonPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import type { ButtonVariants } from "./index.js";
	import { buttonVariants } from "./index.js";

	type $$Props = ButtonPrimitive.Props & {
		variant?: ButtonVariants["variant"];
		size?: ButtonVariants["size"];
	};

	let {
		class: className,
		variant = "default",
		size = "default",
		builders = [],
		children,
		...restProps
	}: $$Props = $props();
</script>

<ButtonPrimitive.Root
	{builders}
	class={cn(buttonVariants({ variant, size, className }))}
	{...restProps}
>
	{@render children?.()}
</ButtonPrimitive.Root>