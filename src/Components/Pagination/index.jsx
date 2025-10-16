import React from 'react';
import './index.css';

const Pagination = (({ setPageNo, pageNo, totalRecords, pageSize = 10 }) => {
    const totalPages = Math.ceil(totalRecords / pageSize);
    const handlePage = (no) => {
        if (no >= 1 && no <= totalPages) {
            setPageNo(no);
        }
        // console.log(no)
    };
    const renderPages = () => {
        const pages = [];
        const start = Math.max(2, pageNo - 1);
        const end = Math.min(totalPages - 1, pageNo + 1);
        // Page 1 always
        pages.push(
            <a
                key={1}
                onClick={() => handlePage(1)}
                className={pageNo === 1 ? 'current-page' : ''}
            >
                1
            </a>
        );

        // Ellipsis if needed
        if (start > 2) pages.push(<span key="left-ellipsis">...</span>);

        for (let i = start; i <= end; i++) {
            pages.push(
                <a
                    key={i}
                    onClick={() => handlePage(i)}
                    className={pageNo === i ? 'current-page' : ''}
                >
                    {i}
                </a>
            );
        }

        if (end < totalPages - 1) pages.push(<span key="right-ellipsis">...</span>);

        // Last page
        if (totalPages > 1) {
            pages.push(
                <a
                    key={totalPages}
                    onClick={() => handlePage(totalPages)}
                    className={pageNo === totalPages ? 'current-page' : ''}
                >
                    {totalPages}
                </a>
            );
        }

        return pages;
    };

    return (
        <div className="pagination-wrap">
            <div className="pagination">
                {/* Prev Button */}
                <a
                    className="prevposts-link"
                    onClick={() => handlePage(pageNo - 1)}
                    style={{
                        cursor: pageNo > 1 ? 'pointer' : 'not-allowed',
                        opacity: pageNo > 1 ? 1 : 0.5,
                    }}
                >
                    <i className="fa fa-caret-left" />
                </a>

                {renderPages()}

                {/* Next Button */}
                <a
                    className="nextposts-link"
                    onClick={() => handlePage(pageNo + 1)}
                    style={{
                        cursor: pageNo < totalPages ? 'pointer' : 'not-allowed',
                        opacity: pageNo < totalPages ? 1 : 0.5,
                    }}
                >
                    <i className="fa fa-caret-right" />
                </a>
            </div>
        </div>
    );
});

export default Pagination;
