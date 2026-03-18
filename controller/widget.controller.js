const { Slug } = require('../models');

const getWidgetData = async (req, res) => {
    try {
        const { type, stream, page = 1, limit = 10 } = req.query;

        // Validate type    
        if (!type || typeof type !== 'string' || type.trim() === '') {
            return res.status(400).json({
                status: false,
                data: false,
                message: 'Parameter "type" is required and must be a valid string.'
            });
        }

        // Prepare query
        const query = {
            deleteflag: false,
            status: true
        };
        if (type) {
            query.type = type
        }

        if (type == "News") {
            query.ComponentType = "news-details"
        } else if (type == "Event") {
            query.ComponentType = "event-details"
        }
        else if (type == "Article") {
            query.ComponentType = "article-details"
        }
        else if (type == "Circular") {
            query.ComponentType = "circular-details"
        }
        if (stream && stream !== 'All') {
            query.stream = stream;
        }


        const parsedLimit = Math.min(parseInt(limit), 100) || 10;
        const parsedPage = Math.max(parseInt(page), 1) || 1;
        const skip = (parsedPage - 1) * parsedLimit;

        // Total count for pagination
        const totalCount = await Slug.countDocuments(query);

        // Paginated result
        const results = await Slug.find(query)
            .select('name shortdesc description banner_img path page_id type date')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parsedLimit);

        return res.status(200).json({
            status: true,
            message: "Data fetched successfully.",
            data: results,
            pagination: {
                total: totalCount,
                page: parsedPage,
                limit: parsedLimit,
                totalPages: Math.ceil(totalCount / parsedLimit)
            }
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal Server Error: " + error.message,
            data: false
        });
    }
};

module.exports = { getWidgetData };
