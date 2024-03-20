import React, { useCallback, useEffect } from 'react'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const PaginationExampleShorthand = (props) => {

    return (
        <div style={{ marginBottom: '10px' }}>
            <Stack spacing={2} style={{ width: 'fit-content', margin: '0 auto' }}>
                <Pagination count={+props.count} onChange={props.onChange} color="secondary" page={props.page} />
            </Stack>
        </div>
    )
}

export default PaginationExampleShorthand