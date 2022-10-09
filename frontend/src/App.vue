<template>
	<div class="app">
		<div class="container">
			<Filter class="app__filter"/>
			<Table class="app__table"/>
		</div>
	</div>
</template>

<script>

import Filter from "./components/Filter";
import Table from "./components/Table";

export default {
	name: 'App',
	components: {Table, Filter},
}
</script>

<style lang="scss">
.app {
	padding: 50px 0;
	&__filter {
		margin-bottom: 30px;
	}
	&__sorting {
		margin-bottom: 30px;
	}
}

</style>
