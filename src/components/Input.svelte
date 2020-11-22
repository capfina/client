<script>

	export let _type = 'number';
	export let value;
	export let placeholder;
	export let disabled = false;
	export let element;
	export let uppercase;

</script>

<style>
	input {
		width: 100%;
		font-family: inherit;
		font-size: inherit;
		padding: 0 9px;
		height: 48px;
		margin: 0;
		outline: none;
		border: 1px solid var(--border-color);
		border-radius: 4px;
	}
	input.uppercase {
		text-transform: uppercase;
	}
	input:focus {
		border-color: var(--color-blue);
	}
	::-webkit-input-placeholder { /* WebKit browsers */
	    text-transform: none;
	}
	:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
	    text-transform: none;
	}
	::-moz-placeholder { /* Mozilla Firefox 19+ */
	    text-transform: none;
	}
	:-ms-input-placeholder { /* Internet Explorer 10+ */
	    text-transform: none;
	}
	::placeholder { /* Recent browsers */
	    text-transform: none;
	}
</style>

{#if _type == 'number'}
	<input
		bind:this={element}
		type='text'
		inputmode='numeric'
		pattern='\d+(?:\.\d*)?'
		{disabled}
		required
		placeholder={placeholder || ''}
		bind:value={value}
	>
{:else}
	<input
		bind:this={element}
		class={uppercase ? 'uppercase' : ''}
		type='text'
		{disabled}
		required
		placeholder={placeholder || ''}
		bind:value={value}
	>
{/if}