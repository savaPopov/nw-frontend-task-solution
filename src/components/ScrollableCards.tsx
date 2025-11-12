import { Grid, Typography } from '@mui/joy'
import InfiniteScroll from 'react-infinite-scroll-component'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { PageRequest } from '../services/dto/page.request.ts'
import { PageResponse } from '../services/dto/page.response.ts'
import { useToast } from '../context/toast/toast.context.tsx'
import { useResponsiveLoading } from '../hooks/useResponsiveLoading.ts'


export default function ScrollableCards<T extends { id?: string }>(props: {
    loadMore: (page: PageRequest) => Promise<PageResponse<T> | undefined>
    mapCard: (value: T, deleteItem: (id: string) => void) => React.JSX.Element
    skeletonMap: (_: any, index: number) => React.JSX.Element
}) {

    const { getOptimalPageSize, getAutoLoadThreshold } = useResponsiveLoading()
    const initialSkeletonCount = getOptimalPageSize('initial')
    const initial = [...Array(initialSkeletonCount)].map(props.skeletonMap)

    const [cards, setCards] = useState<React.JSX.Element[]>(initial)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { showToast } = useToast()

    const isAutoLoading = useRef<boolean>(false)
    const [loadedIds, setLoadedIds] = useState<Set<string>>(new Set())

    const deleteItem = useCallback((id: string) => {
        setCards((prevCardsState) => {
            // console.log("prev cards state")
            // console.log(prevCardsState)
            const i = prevCardsState.findIndex((card) => card.key === id)
            if (i != -1) {
                const newCards = [...prevCardsState]
                // console.log("NEW cards from delete item")
                // console.log(newCards)
                newCards.splice(i, 1)
                // console.log('SPlicedCards')
                // console.log(newCards)
                setLoadedIds(prev => {
                    const newSet = new Set(prev)
                    newSet.delete(id)
                    return newSet
                })
                return newCards
            }
            return prevCardsState
        })

    }, [])

    //TODO fix when users delete without loading all of the items to load properly the items 

    const loadBanners = useCallback(async (customPageSize?: number) => {
        if (isLoading || isAutoLoading.current) {
            return;
        }

        setIsLoading(true)
        isAutoLoading.current = true


        try {
            //choose how many items to load based on the screensize
            const pageSize = customPageSize || getOptimalPageSize('scroll')


            console.log(`loading ${pageSize} items`)

            //remove skeletons 
            const nonSkeletonCards = cards.filter(card =>
                !card.key?.toString().startsWith('skeleton')
            )

            //calculate Actual page so it dosent skip items 
            const calculatedPage = Math.floor(nonSkeletonCards.length / pageSize)


            const newCards = await props.loadMore({ page: calculatedPage, pageSize })

            // console.log(`${page} -page ,${pageSize} -pagesize newCards:`)
            // console.log(newCards)
            if (!newCards || newCards.content.length === 0) {
                setHasMore(false)
                return
            }

            //filter items we have
            const newItems = newCards.content.filter(item => {
                const id = item.id
                if (!id) return false
                if (loadedIds.has(id)) {
                    console.log(`skip duplicate id: ${id}`)
                    return false
                }
                return true
            })


            //safety if all are duplicates
            if (newItems.length === 0 && newCards.maxPageNumber > calculatedPage) {
                console.log('all duplicates, loading next page...')
                setIsLoading(false)
                isAutoLoading.current = false
                await loadBanners(customPageSize)
                return
            }


            // check if there is next page
            setHasMore(newCards.maxPageNumber > newCards.pageNumber)
            // console.log(`has more pages ? ${newCards.maxPageNumber > newCards.pageNumber}`)


            //set already loaded ids
            setLoadedIds(prev => {
                const newSet = new Set(prev);
                newItems.forEach(item => {
                    if (item.id) newSet.add(item.id);
                });
                return newSet;
            });

            const newElements = newItems.map((value) => props.mapCard(value, deleteItem))

            setCards((prevCards) => {
                if (isInitialLoad) {
                    setIsInitialLoad(false)
                    console.log('initial load complete')
                    return newElements
                }

                //appending  items
                console.log(`appending ${newElements.length} items to ${prevCards.length} existing`)
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
            isAutoLoading.current = false
        }
    }, [cards, deleteItem, props, isLoading, isInitialLoad, getOptimalPageSize, loadedIds])

    //load if user deletes too many without scrolling
    useEffect(() => {
        if (!isInitialLoad && hasMore && !isLoading && !isAutoLoading.current) {
            const threshold = getAutoLoadThreshold()
            if (cards.length < threshold) {
                // console.log(`threshold:${threshold}`)

                loadBanners();
                // console.log('cards length' + cards.length)
                console.log('auto-loading more items because card count is low')
                console.log(cards)
            }

        }
    }, [cards.length, isInitialLoad, hasMore, isLoading, loadBanners, getAutoLoadThreshold, showToast])



    useEffect(() => {

        loadBanners()
    }, [])

    const loadMore = () => {
        if (!isLoading && !isAutoLoading.current && hasMore) {
            loadBanners()
        }
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
