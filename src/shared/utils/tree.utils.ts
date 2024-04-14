/**
 * Get array of children data from a node in tree.
 *
 * @param {!Object} node
 * @param {!function=} getData - Function to get the data field from the children nodes
 * @return {Object[]} arrayData - The array contains all the matching results.
 */
export function collectAllChildren<T>({
    node,
    getData,
    arrayData = [],
    onlyDirectChildren = false,
}: {
    [field: string]: any;
    getData: (dataNode: T) => T;
}): T[] {
    if (node?.children?.length) {
        for (let i = 0; i < node.children.length; i++) {
            const data = getData(node.children[i]);
            data && arrayData.push(data);
            !onlyDirectChildren &&
                collectAllChildren({
                    node: node.children[i],
                    getData,
                    arrayData,
                });
        }
    }
    return arrayData;
}

/**
 * Get array data from all of nodes in tree.
 *
 * @param {!Object[]} treeData
 * @param {!function=} getData - Function to get the data field from the children nodes
 * @return {Object[]} arrayData - The array contains all the matching results.
 */
export function collectTreeData<T>({
    treeData = [],
    getData,
    arrayData = [],
}: {
    getData: (node: T) => T;
    [field: string]: any;
}): any[] {
    if (treeData?.length) {
        for (let i = 0; i < treeData.length; i++) {
            const data = getData(treeData[i]);
            data && arrayData.push(data);
            const childrenData = collectAllChildren({
                node: treeData[i],
                getData,
            });
            childrenData?.length && arrayData.push(...childrenData);
        }
    }
    return arrayData;
}

/**
 * Get flat array data from all of nodes in tree.
 *
 * @param {!Object[]} treeData
 */
export function getFlatDataFromTree<T>(treeData: T[]): T[] {
    const getData = (node: T): T => ({
        ...node,
    });
    return collectTreeData({ treeData, getData });
}
