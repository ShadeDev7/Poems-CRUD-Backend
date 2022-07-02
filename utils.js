const getPagination = (quantity, page) => {
    const quantityInteger = Number(quantity);
    const pageInteger = Number(page);

    return {
        quantity:
            Number.isInteger(quantityInteger) && quantityInteger > 0
                ? quantityInteger
                : process.env.DEFAULT_QUANTITY ?? 1,
        page:
            Number.isInteger(pageInteger) && pageInteger > 0
                ? pageInteger
                : process.env.DEFAULT_PAGE ?? 5,
    };
};

const trimAll = str => str.replace(/\s+/g, " ").trim();

module.exports = { getPagination, trimAll };
