import { Grid } from '@mui/joy'
import InfiniteScroll from 'react-infinite-scroll-component'
import React, { useCallback, useEffect, useState } from 'react'
import { PageRequest } from '../services/dto/page.request.ts'
import { PageResponse } from '../services/dto/page.response.ts'

export default function ScrollableCards<T>(props: {
    loadMore: (page: PageRequest) => Promise<PageResponse<T> | undefined>
    mapCard: (value: T, deleteItem: (id: string) => void) => React.JSX.Element
    skeletonMap: (_: any, index: number) => React.JSX.Element
}) {
    const initial = [...Array(6)].map(props.skeletonMap)
    const [cards, setCards] = useState<React.JSX.Element[]>(initial)
    const [page, setPage] = useState<number>(0)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true)

    const deleteItem = useCallback((id: string) => {
        setCards((prevCardsState) => {
            const i = prevCardsState.findIndex((card) => card.key == id)
            if (i != -1) {
                const newCards = [...prevCardsState]
                newCards.splice(i, 1)
                return newCards
            }
            return prevCardsState
        })
    }, [])

    const loadBanners = useCallback(async () => {

        const newCards = await props.loadMore({ page, pageSize: 6 })
        if (!newCards) {
            setHasMore(false)
            return
        }
        // + change to next page
        setPage(newCards.pageNumber + 1)
        console.log(`Total Pages ${page}`)
        // check if there is next page
        setHasMore(newCards.maxPageNumber > newCards.pageNumber)
        console.log(`has more pages ? ${newCards.maxPageNumber > newCards.pageNumber}`)

        // make data to elements
        const newElements = newCards.content.map((value) => props.mapCard(value, deleteItem))

        setCards((prevCards) => {

            if (isInitialLoad) {
                // fist render replace skeletons with real data
                setIsInitialLoad(false)
                return newElements
            }

            // next loads add to existing cards
            return [...prevCards, ...newElements]
        })
        
    }, [cards, page, deleteItem, props])

    useEffect(() => {

        loadBanners().catch((reason) => console.error(reason))
    }, [])

    const loadMore = () => {
        loadBanners().catch((reason) => console.error(reason))
    }

    return (
        <Grid
            container
            spacing={2}
        >
            <InfiniteScroll
                dataLength={cards.length}
                next={loadMore}
                hasMore={hasMore}
                scrollableTarget="scroll"
                loader={<h4>Loading...</h4>}
                endMessage={
                    <p style={{ textAlign: 'center' }}>
                        <b>There are no more items available...</b>
                    </p>
                }
            >
                {...cards}
            </InfiniteScroll>
        </Grid>
    )
}
