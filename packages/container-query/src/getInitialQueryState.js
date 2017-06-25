export default function(jsonStats: {}) {
    return jsonStats.queries.map(() => false);
}
