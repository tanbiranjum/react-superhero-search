import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { IoSearch, IoClose } from 'react-icons/io5'
import { motion, AnimatePresence } from 'framer-motion'
import { useClickOutside } from 'react-click-outside-hook'
import useDebounce from '../../hooks/useDebounce'
import { MoonLoader } from 'react-spinners'

const SearchContainerVariant = {
  expanded: {
    height: '30rem',
  },
  collapsed: {
    height: '5rem',
  },
}

function SearchBar() {
  const [heroes, setHeroes] = useState([])
  const [isExpended, setIsExpended] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [ref, isClickedOutside] = useClickOutside()
  const inputRef = useRef()
  const [isLoading, setIsLoading] = useState(false)

  const searchHandler = (e) => {
    e.preventDefault()
    setSearchQuery(e.target.value)
  }

  const expandContainer = () => {
    setIsExpended(true)
  }

  const collapseContainer = () => {
    setHeroes([])
    setIsExpended(false)
    setSearchQuery('')
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  useEffect(() => {
    if (isClickedOutside === true) {
      collapseContainer()
    }
    return () => {
      console.log('Cleanup function')
    }
  }, [isClickedOutside])

  const prepareSearchQuery = (query) => {
    const url = `https://thingproxy.freeboard.io/fetch/https://superheroapi.com/api/${1332438033621630}/search/${query}`
    return encodeURI(url)
  }

  const searchPokemon = async () => {
    if (!searchQuery || searchQuery.trim() === '') {
      return
    }
    setIsLoading(true)

    const URL = prepareSearchQuery(searchQuery)

    const response = await fetch(URL).catch((err) => {
      console.log(err)
    })

    const data = await response.json()
    setHeroes(data.results)
    setIsLoading(false)
  }

  useDebounce(searchQuery, 500, searchPokemon)
  return (
    <Container>
      <Search
        animate={isExpended ? 'expanded' : 'collapsed'}
        variants={SearchContainerVariant}
        ref={ref}
      >
        <InputContainer>
          <SearchInputCol>
            <SearchIcon>
              <IoSearch />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search for super hero"
              onFocus={expandContainer}
              onChange={searchHandler}
              ref={inputRef}
              value={searchQuery}
            />
          </SearchInputCol>
          <AnimatePresence>
            {isExpended && (
              <CloseIcon
                key="close-icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={collapseContainer}
                transition={{ duration: 0.2 }}
              >
                <IoClose />
              </CloseIcon>
            )}
          </AnimatePresence>
        </InputContainer>
        <LineSeparator />
        <SearchContent>
          {isLoading ? (
            <LoadingWrapper>
              <MoonLoader loading color="#000" size={20} />
            </LoadingWrapper>
          ) : (
            <HeroSearchContainer>
              {heroes &&
                heroes.map((hero) => (
                  <HeroList>
                    <HeroImage src={hero.image.url} />
                    <HeroName>{hero.name}</HeroName>
                  </HeroList>
                ))}
            </HeroSearchContainer>
          )}
        </SearchContent>
      </Search>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  margin: 6rem 0;
`
const Search = styled(motion.div)`
  width: 70%;
  height: 5rem;
  margin: 0 auto;
  padding: 0.5rem 0.8rem;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  overflow: hidden;
`

const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  height: 5rem;
  padding-bottom: 0.5rem;
`

const SearchInputCol = styled.div`
  display: flex;
  flex: 1;
  gap: 10px;
`

const SearchInput = styled.input`
  border: none;
  font-size: 2rem;
  &:focus {
    outline: none;
  }
  flex: 1;
`

const SearchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    font-size: 2rem;
  }
`

const CloseIcon = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  svg {
    font-size: 2rem;
  }
`

const LineSeparator = styled.span`
  display: flex;
  min-width: 100%;
  min-height: 2px;
  background-color: #d8d8d878;
`

const SearchContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const LoadingWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const HeroSearchContainer = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`

const HeroList = styled.li`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1rem;
  cursor: pointer;
  padding: 1rem;
  border-bottom: 2px solid #d8d8d878;
`

const HeroImage = styled.img`
  width: 4rem;
`

const HeroName = styled.p`
  font-size: 2rem;
`

export default SearchBar
