import Link from "next/link";
import React from "react";
import Navbar from "../components/Navbar";
import Header from "./components/Header";
import SearchSideBar from "./components/SearchSideBar";
import RestaurandCard from "./components/RestaurandCard";
import { prisma } from "@/db";
import { PRICE } from "@prisma/client";
export const metadata = {
  title: "Search",
  description: "Generated by create next app",
};
interface SearchParams {
  city?: string;
  cuisine?: string;
  price?: PRICE;
}

const fetchRestaurantByCity = (searchParams: SearchParams) => {
  const where: any = {};

  if (searchParams.city) {
    const locaton = {
      name: {
        equals: searchParams.city.toLowerCase(),
      },
    };
    where.locaton = locaton;
  }

  if (searchParams.cuisine) {
    const cuisine = {
      name: {
        equals: searchParams.cuisine.toLowerCase(),
      },
    };
    where.cuisine = cuisine;
  }
  if (searchParams.price) {
    const price = {
      equals: searchParams.price,
    };
    where.price = price;
  }

  /*
    This is img because wehave two referencing fields i.e cuision and location
    We cant directly access cuision and location fields. So we need to
    put them under select field.
    using select 
    locaton: {
      id: 1,
      name: 'ottawa',
      created_at: 2023-05-29T08:39:35.582Z,
      updated_at: 2023-05-29T08:39:35.582Z
    },
    without select 
    location_id :2
    */

  const select = {
    id: true,
    slug: true,
    name: true,
    main_image: true,
    cuisine: true,
    locaton: true,
    price: true,
    reviews: true,
  };

  return prisma.restaurant.findMany({
    where,
    select,
  });
};

const fetchLocations = async () => {
  return prisma.location.findMany();
};
const fetchCuisines = async () => {
  return prisma.cuisine.findMany();
};

export default async function SearchPage(
  //In NextJs,we can directly access query strings like this.
  {
    searchParams,
  }: {
    //make optional Imp
    searchParams: { city?: string; cuisine?: string; price?: PRICE };
  }
) {
  //await is imp
  const restaurants = await fetchRestaurantByCity(searchParams);
  const locations = await fetchLocations();
  const cuisines = await fetchCuisines();
  return (
    <>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSideBar
          searchParams={searchParams}
          locations={locations}
          cusinies={cuisines}
        />
        <div className="w-5/6">
          {restaurants.length ? (
            <>
              {restaurants.map((restaurant, index) => (
                <RestaurandCard key={index} restaurant={restaurant} />
              ))}
            </>
          ) : (
            <p>Sorry, No restaurants matched in this area.</p>
          )}
        </div>
      </div>
    </>
  );
}
