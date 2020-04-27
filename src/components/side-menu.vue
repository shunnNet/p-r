<template>
    <nav>
        <ul class="menu menu--primary">
            <li class="menu__list">
                <router-link class="menu__list__link" to="/view">閱讀</router-link>
            </li>
            <li class="menu__list">
                <router-link class="menu__list__link" to="/graph">圖表</router-link>
            </li>
            <li class="menu__list">
                <router-link class="menu__list__link" to="/config">設定</router-link>
                
            </li>
        </ul>
    </nav>
</template>

<script>
export default {
    name : "side-menu",
}
</script>

<style lang="scss">
@import "../scss/env";
    .menu{
        &__list{
            text-align: center;
            &__link{
                padding: 10px;
                display: block;
            }
        }
    }
    .menu--primary {
        .menu__list__link{
            &:hover{
                color: red;
            }
        }
    }
</style>