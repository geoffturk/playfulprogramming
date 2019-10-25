import React, { createRef, useRef, useMemo } from "react"
import { Link } from "gatsby"
import cardStyles from "./post-card.module.scss"
import { stopPropCallback } from "../../utils/preventCallback"
import { UserProfilePic } from "../user-profile-pic"

/**
 * @param {string} title - The title of the post
 * @param {UnicornInfo[]} authors - Info on the authors of the post
 * @param {string} published - Date the author published the post
 * @param {string[]} tags - List of tags associated with the post
 * @param {string} excerpt - The autogenerated excerpt from the GraphQL call
 * @param {string} slug - The post URL slug (which is also it's unique ID)
 * @param {string} [description] - The manually written description of the post in the post frontmatter
 * @param {string} [className] - Classname to pass to the post card element
 */
export const PostCard = ({ title, authors, published, tags, excerpt, description, className, slug }) => {
  const headerLink = useRef()
  const authorLinks = useMemo(() => authors.map((unicorn) => {
    const ref = createRef()
    const onClick = (e) => {
      stopPropCallback(e)
      ref.current.click()
    }

    return {
      unicorn,
      onClick,
      ref,
    }
  }), [authors])

  return (
    <li className={`${cardStyles.card} ${className}`} onClick={() => headerLink.current.click()} role="listitem">
      <div className={cardStyles.cardContents}>
        <Link
          to={`/posts${slug}`}
          onClick={stopPropCallback}
          className="unlink"
        >
          <h2
            className={cardStyles.header}
            ref={headerLink}
          >
            {title}
          </h2>
        </Link>
        <p className={cardStyles.authorName}>
          <span>by&nbsp;</span>
          <Link
            to={`/unicorns/${authors[0].id}`}
            className={cardStyles.authorLink}
            ref={authorLinks[0].ref}
          >
            {authors[0].name}
          </Link>
          {/* To avoid having commas on the first author name, we did this */}
          {authors.slice(1).map((author, i) => {
            return (<React.Fragment key={author.id}>
                <span>, </span>
                <Link
                  key={author.id}
                  to={`/unicorns/${author.id}`}
                  className={cardStyles.authorLink}
                  ref={authorLinks[i].ref}
                >
                  {author.name}
                </Link>
              </React.Fragment>
            )
          })}
        </p>
        <div className={cardStyles.dateTagSubheader}>
          <p className={cardStyles.date}>{published}</p>
          <div>
            {
              tags.map(tag => (
                <span
                  key={tag}
                  className={cardStyles.tag}
                >
                  {tag}
                </span>
              ))
            }
          </div>
        </div>
        <p className={cardStyles.excerpt} dangerouslySetInnerHTML={{
          __html: description || excerpt,
        }}
        />
      </div>
      <UserProfilePic authors={authorLinks} className={cardStyles.authorImagesContainer}/>
    </li>
  )
}

