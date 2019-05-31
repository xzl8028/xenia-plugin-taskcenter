package main

import (
	"sync"

	"github.com/xzl8028/xenia-server/plugin"
)

type Plugin struct {
	plugin.XeniaPlugin

	// configurationLock synchronizes access to the configuration.
	configurationLock sync.RWMutex

	// configuration is the active plugin configuration. Consult getConfiguration and
	// setConfiguration for usage.
	configuration *configuration

	// BotId of the created bot account.
	botId string
}
