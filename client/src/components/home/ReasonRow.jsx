// client/src/components/home/ReasonRow.jsx

// one alternating image/text row, reverse flips it to text/image
export function ReasonRow({ image, alt, heading, body, reverse = false }) {
  return (
    <div className={reverse ? 'reason-row is-reversed' : 'reason-row'}>
      <img src={image} alt={alt} className="reason-image" />
      <div className="reason-text">
        <h3>{heading}</h3>
        <p>{body}</p>
      </div>
    </div>
  )
}
