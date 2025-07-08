<script lang="ts">
	import { Dialog as DialogPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import { fade, scale } from "svelte/transition";

	type $$Props = DialogPrimitive.Root.Props;

	let { children, ...restProps }: $$Props = $props();
</script>

<DialogPrimitive.Root {...restProps}>
	{@render children?.()}
</DialogPrimitive.Root>