<template>
    <nav>
        <ul class="menu menu--primary">
            <li class="menu__list">
                <router-link class="menu__list__item" to="/view">
                    <font-awesome-icon class="menu__list__item__icon" icon="tasks"></font-awesome-icon>
                    閱讀
                </router-link>
            </li>
            <li class="menu__list">
                <router-link class="menu__list__item" to="/config">
                    <font-awesome-icon class="menu__list__item__icon" icon="cog"></font-awesome-icon>
                    調整
                </router-link>
            </li>
            <li class="menu__list">
                <router-link class="menu__list__item" to="/info">
                    <font-awesome-icon class="menu__list__item__icon" icon="question-circle"></font-awesome-icon>
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
                    margin-right: 0.6em;
                    font-size: 1.5em;
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