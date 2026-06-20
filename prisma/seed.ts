async function main() {
  console.log("Seeding skipped. Convoke launch mode does not inject fake ecosystem data.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
