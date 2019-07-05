module github.com/xzl8028/xenia-plugin-taskcenter

go 1.12

require (
	github.com/blang/semver v3.5.1+incompatible
	github.com/go-ldap/ldap v3.0.3+incompatible // indirect
	github.com/hashicorp/go-hclog v0.9.0 // indirect
	github.com/lib/pq v1.1.1 // indirect
	github.com/nicksnyder/go-i18n v1.10.0 // indirect
	github.com/pelletier/go-toml v1.4.0 // indirect
	github.com/pkg/errors v0.8.1
	github.com/stretchr/objx v0.2.0 // indirect
	github.com/stretchr/testify v1.3.0
	github.com/xzl8028/go-i18n v1.10.0 // indirect
	github.com/xzl8028/xenia-server v0.0.0-20190704033831-6c6fc3746827
	golang.org/x/crypto v0.0.0-20190506204251-e1dfcc566284 // indirect
	golang.org/x/sys v0.0.0-20190508100423-12bbe5a7a520 // indirect
	golang.org/x/tools v0.0.0-20190703212419-2214986f1668 // indirect
	google.golang.org/genproto v0.0.0-20190508193815-b515fa19cec8 // indirect
)

// Workaround for https://github.com/golang/go/issues/30831 and fallout.
replace github.com/golang/lint => github.com/golang/lint v0.0.0-20190227174305-8f45f776aaf1
