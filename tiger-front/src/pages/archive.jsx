import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import ArticleDisplay from "../components/ArticleDisplay";
import CardLarge from "../components/CardLarge";
import CardMedium from "../components/CardMedium";
import Loading from "../components/Loading"
import { db } from "../firebase/db";

const Archive = () => {


  return (
        <div className="min-h-screen">
            <h1 className="text-4xl font-extrabold text-left mb-4">Archive</h1>
            <hr className="h-[1.5px] w-full border-0 bg-[#DEDEDE] mt-4 mb-2" />
            <hr className="h-[1.5px] w-full border-0 bg-[#DEDEDE] mb-2 lg:mb-8" />
            <div className="max-w-full mx-auto lg:max-w-[70%]">
                <ArticleDisplay section={"ALL"}/>
            </div>
        </div>
    )
}

export default Archive