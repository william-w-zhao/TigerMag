const ArticlePreview = ({title, description, author, content, section, image}) => {
    return (
        <div style={{
    whiteSpace: "pre-wrap",
    overflowWrap: "break-word",
    wordBreak: "break-word",
    maxWidth: "100%",
  }}>
            <label>Preview</label>
            <h2>{title}</h2>
            <h3>{section} {description}</h3>
            <h3>{author}</h3>
            <p>{content}</p>
        </div>
    )
}

export default ArticlePreview