<template>
    <ul>
        <li>
            <router-link to="/view">閱讀</router-link>
        </li>
        <li>
            <router-link to="/graph">圖表</router-link>
        </li>
        <li>
            <router-link to="/config">設定</router-link>
            
        </li>
    </ul>
</template>

<script>
export default {
    name : "side-menu",
}
</script>