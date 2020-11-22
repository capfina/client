<script>
	export let group;
	export let value;
	export let label;
</script>

<label>
	<input type=radio bind:group={group} value={value}> {label}
</label>