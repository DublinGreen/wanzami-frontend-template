const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const footerCopyright = getFooterDate(LEGAL_NAME);

        onMounted(() => {
        });

        return {
            footerCopyright,
        };
    }
}).mount('#appVue');