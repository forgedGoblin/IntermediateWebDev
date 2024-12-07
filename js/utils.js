// * Safe Try/Await *

/**
 * @function
 * @template T
 * @param {() => T} cb The codeblock to run
 * @returns {[null, T] | [Error, null]}
 */
export const safeTry = cb => {
    try {
        return [null, cb()];
    } catch (err) {
        return [err, null];
    }
};

/**
 * @function
 * @template T
 * @param {() => Promise<T> | Promise<T>} f The promise or the async function to await
 * @returns {Promise<[null, T]|[Error, null]>}
 */
export const safeAwait = async f => {
    try {
        return [null, await (typeof f === "function" ? f() : f)];
    } catch (err) {
        return [err, null];
    }
};
