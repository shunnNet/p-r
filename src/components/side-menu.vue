<template>
    <nav>
        <ul class="menu menu--primary">
            <li class="menu__list">
                <router-link class="menu__list__item" to="/view">
                    <font-awesome-icon icon="tasks" class="menu__list__item__icon"/>
                    閱讀
                </router-link>
            </li>
            <li class="menu__list">
                <router-link class="menu__list__item" to="/config">
                    <font-awesome-icon icon="cog" class="menu__list__item__icon"/>
                    調整
                </router-link>
            </li>
            <li class="menu__list">
                <router-link class="menu__list__item" to="/info">
                    <font-awesome-icon icon="question-circle" class="menu__list__item__icon"/>
                    幫助
                </router-link>
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
            &__item{
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1em;
                &__icon{
                    font-size: 1.5em;
                    margin-right: 0.6em;
                }
            }

        }
    }
    .menu--primary {
        .menu__list__item{
            &:hover{
                color: $main;
            }
            @include touch-device-mobile--hover{
                color: inherit;
            }
            
        }
    }
</style>