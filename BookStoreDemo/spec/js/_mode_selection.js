//@provengo summon rest

// Temporary workaround for selecting the mode of operation in the BookStoreDemo test suite.
// Ideally, this should be handled cleanly via a dedicated command or a built-in API feature,
// but such a mechanism is either not available or not yet known to me (Gera).
// Supported modes are "LINEAR" and "MODEL".
// The mode can be specified using the option `-c mode=<mode>` when running the test.


// "LINEAR" or "MODEL" mode selection
with (Main.options.getOptional('mode', Packages.java.lang.String)) {
  const mode = isPresent() ? get() : "LINEAR"; // Default to LINEAR if not specified
}

bp.log.info("Starting BookStoreDemo test with mode: " + mode);

