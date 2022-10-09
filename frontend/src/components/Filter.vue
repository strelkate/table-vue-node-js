<template>
	<div class="filters">
		<div class="filters__top">
			<div class="filters__wrapper">
				<label class="filters__label" for="filters-column">Выберите название колонки:</label>
				<select name="filters-column" id="filters-column" v-model="req.filter.column">
					<option value="">Выберите название колонки</option>
					<option value="date">Дата</option>
					<option value="name">Название</option>
					<option value="quantity">Количество</option>
					<option value="distance">Расстояние</option>
				</select>
			</div>
			<div class="filters__wrapper">
				<label class="filters__label" for="filters-condition">Выберите условие:</label>
				<select name="filters-condition" id="filters-condition" v-model="req.filter.condition">
					<option value="">Выберите условие</option>
					<option value="equal">Равно</option>
					<option value="contain">Содержит</option>
					<option value="greater">Больше</option>
					<option value="less">Меньше</option>
				</select>
			</div>
			<div class="filters__wrapper">
				<label class="filters__label" for="filters-value">Введите значение:</label>
				<input
					v-model="req.filter.value"
					type="text"
					name="filters-value"
					id="filters-value"
					placeholder="Введите значение"
				/>
			</div>
		</div>
		<div class="filters__error" v-if="!isFilterValid">Выберите и введите корректные фильтры</div>
		<div class="filters__sorting">
			<div class="filters__wrapper">
				<label class="filters__label" for="sorting">Сортировать по:</label>
				<select
					name="sorting"
					id="sorting"
					v-model="req.order_by"
				>
					<option value="">Выберите сортировку</option>
					<option value="name">Название</option>
					<option value="quantity">Количество</option>
					<option value="distance">Расстояние</option>
				</select>
			</div>
			<button class="filters__button" @click="onFiltersClick">Поиск</button>
		</div>
	</div>
</template>

<script>
const COLUMN_DATE = 'date'
const COLUMN_NAME = 'name'
const COLUMN_QUANTITY = 'quantity'
const COLUMN_DISTANCE = 'distance'

const CONDITION_EQUAL = 'equal'
const CONDITION_CONTAIN = 'contain'
const CONDITION_GREATER_THAN = 'greater'
const CONDITION_LESS_THAN = 'less'

const DEFAULT_LIMIT = 20

import {mapActions, mapGetters} from "vuex";

export default {
	name: "Filter",
	data() {
		return {
			req: {
				order_by: '',
				filter: {
					column: '',
					condition: '',
					value: ''
				},
				pagination: {
					limit: DEFAULT_LIMIT,
					offset: 0
				}
			},
			loading: false,
			finish: false
		}
	},
	computed: {
		...mapGetters(['getTableRows']),
		isFilterValid() {
			if (!(this.req.filter.column === '' && this.req.filter.condition === '' && this.req.filter.value === '' ||
				this.req.filter.column !== '' && this.req.filter.condition !== '' && this.req.filter.value !== '')) {
				return false
			}
			switch (this.req.filter.condition) {
				default:
					return false
				case '':
				case CONDITION_EQUAL:
					break
				case CONDITION_CONTAIN:
					switch (this.req.filter.column) {
						case COLUMN_DATE:
						case COLUMN_QUANTITY:
						case COLUMN_DISTANCE:
							return false
					}
					break
				case CONDITION_GREATER_THAN:
					if (this.req.filter.column === COLUMN_NAME) {
						return false
					}
					break
				case CONDITION_LESS_THAN:
					if (this.req.filter.column === COLUMN_NAME) {
						return false
					}
					break
			}
			return true
		}
	},
	methods: {
		...mapActions(['loadTableRows', 'nextTableRows']),
		onFiltersClick() {
			if (!this.isFilterValid) {
				return
			}
			this.req.pagination = {
				limit: DEFAULT_LIMIT,
				offset: 0
			}
			this.finish = false
			this.loadTableRows(this.req).catch(err => {
				console.log('failed to load table rows', err)
			})
		},
	},
	created() {
		window.onscroll = () => {
			if (this.finish ||
				((window.innerHeight + window.scrollY) < document.body.scrollHeight - 100) ||
				this.loading
			) return
			this.loading = true
			this.req.pagination.offset = this.getTableRows.length
			this.nextTableRows(this.req).then(rows => {
				this.loading = false
				if (rows.length === 0) {
					this.finish = true
				}
			}).catch(err => {
				console.log('failed to load next table rows', err)
			})
		}
	}
}
</script>

<style lang="scss">
.filters {
	position: relative;
	display: flex;
	flex-direction: column;

	&__label {
		margin-right: 10px;
	}

	&__top {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	&__sorting {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 45px;
	}

	&__button {
		width: 100px;
		background-color: $color-primary;
		border: 1px solid $color-text;
		border-radius: 5px;
		padding: 5px;
		cursor: pointer;
	}

	&__error {
		color: red;
		font-size: 12px;
		position: absolute;
		top: 50px;
		right: 50%;
		transform: translateX(50%);
	}
}
</style>
