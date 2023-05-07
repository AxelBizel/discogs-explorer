import _ from "lodash";
import React, { useState, useEffect } from "react";
import CollectionDisplayCard from "./CollectionDisplayCard";
import { connect } from "react-redux";
import Loader from "./Loader";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { getReleases, getCollectionCount } from "../actions";
import CollectionLoader from "./CollectionLoader";

function CollectionDisplay({
  collection,
  collection_count,
  // filterBy,
  // sortBy,
  dispatch,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [displayLoader, setDisplayLoader] = useState(false);
  const [lastPage, setLastPage] = useState(undefined);
  const [releasesToDisplay, setReleasesToDisplay] = useState(undefined);
  const totalLength = collection?.length || 0;
  const totalReleaseNumber = localStorage.getItem("totalReleaseNumber");

  useEffect(() => {
    setDisplayLoader(collection_count < totalReleaseNumber * 0.9);
  }, [collection_count, totalReleaseNumber]);

  useEffect(() => {
    if (!collection_count) {
      dispatch(getCollectionCount());
    }
  }, [dispatch, collection_count]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (displayLoader) {
        dispatch(getCollectionCount());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [displayLoader]);

  useEffect(() => {
    if (collection?.length) {
      setReleasesToDisplay(_.cloneDeep(collection));
    } else {
      setReleasesToDisplay([]);
    }
  }, [totalLength, currentPage, collection]);

  useEffect(() => {
    setLastPage(Math.ceil(collection_count / 144));
  }, [collection_count]);

  useEffect(() => {
    dispatch(getReleases(currentPage));
  }, [currentPage, dispatch]);

  const handlePage = (direction) => {
    if (direction === "next") {
      setCurrentPage(currentPage + 1);
    } else if ((direction = "previous")) {
      setCurrentPage(currentPage - 1);
    }
    setReleasesToDisplay(undefined);
  };

  // const collectionSort = (property) => {
  //   switch (property) {
  //     case "Artist (asc)":
  //       return function (a, b) {
  //         return a["artists_releases"][0]["artists"]["name"].localeCompare(
  //           b["artists_releases"][0]["artists"]["name"]
  //         );
  //       };
  //     case "Artist (desc)":
  //       return function (a, b) {
  //         return b["artists_releases"][0]["artists"]["name"].localeCompare(
  //           a["artists_releases"][0]["artists"]["name"]
  //         );
  //       };
  //     case "Title (asc)":
  //       return function (a, b) {
  //         return a["title"].localeCompare(b["title"]);
  //       };
  //     case "Title (desc)":
  //       return function (a, b) {
  //         return b["title"].localeCompare(a["title"]);
  //       };
  //     case "Year (asc)":
  //       return function (a, b) {
  //         return a["releaseYear"]
  //           .toString()
  //           .localeCompare(b["year"])
  //           .toString();
  //       };
  //     case "Year (desc)":
  //       return function (a, b) {
  //         return b["releaseYear"]
  //           .toString()
  //           .localeCompare(a["year"])
  //           .toString();
  //       };
  //     default:
  //       break;
  //   }
  // };

  // if (collection && sortBy) {
  //   releasesToDisplay = collection.sort(collectionSort(sortBy));
  // }

  return (
    <>
      {displayLoader && (
        <CollectionLoader
          collectionLength={collection_count}
          totalRelease={totalReleaseNumber}
        />
      )}
      {!collection || !releasesToDisplay ? (
        <Loader />
      ) : (
        releasesToDisplay
          // .sort(collectionSort(sortBy))
          // .filter((item) => {
          //   const regex = new RegExp(filterBy, "i");
          //   return regex.test(
          //     item.title +
          //       item.artists_releases.map((a) => a.artists.name).join("") +
          //       item.labels_releases.map((l) => l.labels.name).join("") +
          //       item.releaseYear
          //   );
          // })
          .map((item, index) => (
            <CollectionDisplayCard
              key={`card-${index}`}
              item={item}
              index={index}
            />
          ))
      )}
      <div
        style={{
          margin: "auto",
          marginTop: "2vh",
          width: 200,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Pagination aria-label="Page navigation example">
          {currentPage > 1 && releasesToDisplay && (
            <PaginationItem>
              <PaginationLink previous onClick={() => handlePage("previous")} />
            </PaginationItem>
          )}
          {currentPage < lastPage && releasesToDisplay && (
            <PaginationItem>
              <PaginationLink next onClick={() => handlePage("next")} />
            </PaginationItem>
          )}
        </Pagination>
      </div>
    </>
  );
}

function mstp(state) {
  return {
    collection: state.collection,
    collection_count: state.collection_count,
    // sortBy: state.sortBy,
    // filterBy: state.filterBy,
  };
}

export default connect(mstp)(CollectionDisplay);
