const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const footerCopyright = getFooterDate(APP);

        onMounted(() => {
        });

        return {
            footerCopyright,
        };
    }
}).mount('#appVue');