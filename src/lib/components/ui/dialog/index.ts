import { Dialog as DialogPrimitive } from "bits-ui";

import Root from "./dialog.svelte";
import Content from "./dialog-content.svelte";

const Dialog = Object.assign(Root, {
	Root,
	Content,
	Trigger: DialogPrimitive.Trigger,
	Portal: DialogPrimitive.Portal,
	Overlay: DialogPrimitive.Overlay,
	Close: DialogPrimitive.Close,
	Title: DialogPrimitive.Title,
	Description: DialogPrimitive.Description,
});

export {
	Root,
	Content,
	Dialog,
	DialogPrimitive
};