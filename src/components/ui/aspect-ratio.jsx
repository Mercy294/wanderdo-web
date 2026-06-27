function AspectRatio({ ratio = 1, className, children, style, ...props }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: `${(1 / ratio) * 100}%`,
        ...style,
      }}
      className={className}
      {...props}
    >
      <div style={{ position: "absolute", inset: 0 }}>{children}</div>
    </div>
  );
}

export { AspectRatio };
