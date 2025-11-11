import { Grid, Typography } from '@mui/joy'
import InfiniteScroll from 'react-infinite-scroll-component'
import React, { useCallback, useEffect, useState } from 'react'
import { PageRequest } from '../services/dto/page.request.ts'
import { PageResponse } from '../services/dto/page.response.ts'
import { useToast } from '../context/toast/toast.context.tsx'
import { useResponsiveLoading } from '../hooks/useResponsiveLoading.ts'


export default function ScrollableCards<T>(props: {
    loadMore: (page: PageRequest) => Promise<PageResponse<T> | undefined>
    mapCard: (value: T, deleteItem: (id: string) => void) => React.JSX.Element
    skeletonMap: (_: any, index: number) => React.JSX.Element
}) {

    const { getOptimalPageSize, getAutoLoadThreshold, getScreenSize } = useResponsiveLoading()
    const initialSkeletonCount = getOptimalPageSize('initial')
    const initial = [...Array(initialSkeletonCount)].map(props.skeletonMap)
    const [cards, setCards] = useState<React.JSX.Element[]>(initial)
    const [page, setPage] = useState<number>(0)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { showToast } = useToast()

    const deleteItem = useCallback((id: string) => {
        setCards((prevCardsState) => {
            const i = prevCardsState.findIndex((card) => card.key == id)
            if (i != -1) {
                const newCards = [...prevCardsState]
                // console.log("NEW cards from delete item")
                // console.log(newCards)
                newCards.splice(i, 1)
                return newCards
            }
            return prevCardsState
        })
    }, [])

    //TODO fix when users delete without loading all of the items to load properly the items 

    const loadBanners = useCallback(async (customPageSize?: number) => {
        if (isLoading === true) {
            return;
        }

        setIsLoading(true)


        try {
            const pageSize = customPageSize || getOptimalPageSize('scroll')
            const screenSize = getScreenSize()

            console.log(`loading ${pageSize} items  for  ${screenSize}`)
           
            const newCards = await props.loadMore({ page, pageSize })

            console.log(`${page} -page ,${pageSize} -pagesize newCards:`)
            console.log(newCards)
            if (!newCards) {
                setHasMore(false)
                return
            }


            // + change to next page
            setPage(newCards.pageNumber + 1)
            // console.log(`Total Pages ${page}`)
            // check if there is next page
            setHasMore(newCards.maxPageNumber > newCards.pageNumber)
            // console.log(`has more pages ? ${newCards.maxPageNumber > newCards.pageNumber}`)

            // make data to elements
            // const newElements = newCards.content.map((value) => props.mapCard(value, deleteItem))
            const newElements = newCards.content.map((value) => {
                // console.log('mapping value:', value)
                return props.mapCard(value, deleteItem)
            })



            setCards((prevCards) => {

                if (isInitialLoad) {
                    // fist render replace skeletons with real data
                    setIsInitialLoad(false)
                    console.log('Intial load elements')
                    console.log(newElements)
                    return newElements
                }
                // console.log('prevCards')
                // console.log(prevCards)
                // console.log('New elements')
                // console.log(newElements)
                // next loads add to existing cards

                return [...prevCards, ...newElements]
            })

        } catch (error) {


            const errorMessage = error instanceof Error
                ? error.message
                : 'Failed to load items'
            showToast(errorMessage, 'error')
            setHasMore(false)


        } finally {
            setIsLoading(false)
        }
    }, [page, deleteItem, props, isLoading, isInitialLoad, getOptimalPageSize, getScreenSize, isInitialLoad])

    //load if user deletes too many without scrolling
    useEffect(() => {
        if (!isInitialLoad && hasMore && !isLoading) {
            const threshold = getAutoLoadThreshold()
            if (cards.length < threshold) {
                // console.log(`threshold:${threshold}`)
                loadBanners().catch((reason) => showToast(reason, 'error'))
                console.log('cards length' + cards.length)
                console.log('auto-loading more items because card count is low')
                console.log(cards)

            }

        }
    }, [cards.length, isInitialLoad, hasMore, isLoading, loadBanners, getAutoLoadThreshold, getScreenSize, showToast])



    useEffect(() => {

        loadBanners().catch((reason) => console.error(reason))
    }, [])

    const loadMore = () => {
        loadBanners().catch((reason) => console.error(reason))
    }

    return (

        <InfiniteScroll
            dataLength={cards.length}
            next={loadMore}
            hasMore={hasMore}
            scrollableTarget="scroll"
            loader={
                <Typography level="h4" sx={{ textAlign: 'center', py: 2 }}>
                    Loading...
                </Typography>
            }
            endMessage={
                <Typography
                    level="body-md"
                    sx={{
                        textAlign: 'center',
                        marginTop: '50px',
                        fontWeight: 'bold'
                    }}
                >
                    There are no more items available...
                </Typography>
            }
            style={{ overflow: 'visible' }}
        >
            <Grid
                container
                spacing={2}
                columns={12}
            >
                {cards}
            </Grid>
        </InfiniteScroll >

    )
}
