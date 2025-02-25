import { defineQuery } from "next-sanity";

export const STARTUP_QUERY =
  defineQuery(`*[_type=='startup' && defined(slug.current) && !defined($search) ||category match $search || title match $search || author->name match $search ] | order(_createdAt desc) {
  author ->{name,image,bio,_id},
    _id,
    _createdAt,
    image,
    description,
    views,
    category,
    title,
    slug, 
    }  
`);
export const STARTUP_BY_ID_QUERY =
  defineQuery(`*[_type=='startup' && _id==$id ][0] {
  author ->{name,image,username,bio,_id},
    _id,
    _createdAt,
    image,
    description,
    views,
    category,
    title,
    pitch,
    slug, 
 }`);
