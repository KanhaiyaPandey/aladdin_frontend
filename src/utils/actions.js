const layoutLoader = async () => {
    try {
        const response = await fetch('/api/layout-data');
        return response;
    } catch (error) {
        // handle error if needed
        return null;
    }
};


