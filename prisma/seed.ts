async function main() {
  console.log(
    "Convoke seed skipped. This rebuild intentionally does not create dummy data.",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
