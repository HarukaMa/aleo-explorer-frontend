<script lang="ts">
  import PageHeader from "$lib/components/PageHeader.svelte"
</script>

<style lang="scss">
  @use "/static/styles/variables" as *;

  .content {
    max-width: 700px;
    margin: 40px auto 0;
  }

  h2 {
    font-family: "Montserrat Variable", sans-serif;
    font-size: 18px;
    font-weight: 600;
    margin-top: 56px;
    margin-bottom: 0px;
  }

  h3 {
    font-family: "Montserrat Variable", sans-serif;
    font-size: 14px;
    font-weight: 700;
    margin-top: 16px;
    margin-bottom: 0px;
  }

  p {
    color: #333;
    margin: 0px;
    margin-top: 0px;
  }

  a {
    color: $blue-500;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
</style>

<div class="header">
  <PageHeader content="FAQ" />
</div>

<div class="content">
  <h2>General Questions</h2>

  <h3>What is Aleoscan?</h3>
  <p>
    Aleoscan is an open-source explorer for the Aleo blockchain that allows users to view transactions, blocks,
    addresses, validators, and more. Aleoscan indexes data from the Aleo blockchain and presents it in a user-friendly
    interface, allowing users to explore on-chain activity.
  </p>

  <h3>Is Aleoscan an official Aleo product?</h3>
  <p>
    No, Aleoscan is an independent open-source blockchain explorer built for the Aleo network.
  </p>

  <h3>Can I use Aleoscan to send or receive transactions?</h3>
  <p>
    No, Aleoscan is a read-only blockchain explorer. To send or receive transactions, you need a wallet that
    supports Aleo.
  </p>

  <h2>Transactions & Blocks</h2>

  <h3>Why can't I see my transaction on Aleoscan?</h3>
  <p>
    Transactions might take time to be confirmed. If it remains missing for a long time, check if it was
    broadcasted correctly in your wallet.
  </p>

  <h3>Why is my transaction marked as 'Rejected'?</h3>
  <p>
    A transaction may be rejected due to insufficient funds, incorrect parameters, or network congestion.
  </p>

  <h3>What does an unconfirmed transaction mean?</h3>
  <p>
    An unconfirmed transaction means it has been submitted but has not yet been included in a block.
  </p>

  <h3>How can I check block details?</h3>
  <p>
    You can search for a block number or hash in Aleoscan to see details such as transactions, timestamp, and
    miner information.
  </p>

  <h2>Addresses & Validators</h2>

  <h3>How do I find an address on Aleoscan?</h3>
  <p>
    You can search for any Aleo address in the search bar to view its transaction history and balance (for public
    tokens).
  </p>

  <h3>Why is my address balance not updating?</h3>
  <p>
    Aleoscan does not display private balances. Only public token balances are visible.
  </p>

  <h3>What is a validator?</h3>
  <p>
    Validators participate in securing the Aleo network by processing transactions and producing blocks.
  </p>

  <h3>How can I see if a validator is active?</h3>
  <p>
    Each validator's status is displayed on Aleoscan, showing if they are actively participating in the network.
  </p>

  <h2>Privacy & Security</h2>

  <h3>Can Aleoscan see my private transactions?</h3>
  <p>
    No, private transactions remain encrypted and cannot be viewed on Aleoscan. Only the involved parties
    can see the details in their wallet.
  </p>

  <h3>Is Aleoscan safe to use?</h3>
  <p>
    Yes, Aleoscan is a read-only explorer and does not interact with your wallet or private keys.
  </p>

  <h3>Can I track private tokens on Aleoscan?</h3>
  <p>
    No, Aleoscan only supports tracking public tokens. Private transactions and balances are not visible.
  </p>

  <h2>Other Questions</h2>

  <h3>Can I use Aleoscan for analytics?</h3>
  <p>
    Yes, Aleoscan provides insights into network activity, validator performance, and transaction trends.
  </p>

  <h3>How often is Aleoscan updated?</h3>
  <p>
    Aleoscan continuously syncs with the Aleo blockchain to provide up-to-date data.
  </p>

  <h3>Who can I contact for support?</h3>
  <p>
    Aleoscan is an explorer, not a support channel for exchanges or wallets. If you need help with transactions,
    contact your wallet or exchange provider.
  </p>

  <h3>Does Aleoscan have an API?</h3>
  <p>
    API users can find documentation here: <a href="https://aleoscan.io/api/docs/" target="_blank" rel="noopener noreferrer">Aleoscan API Docs</a>
  </p>

  <h3>How can I report a bug or suggest a feature?</h3>
  <p>
    You can reach out to the Aleoscan team via <a href="mailto:privacy@aleoscan.io">privacy@aleoscan.io</a>.
  </p>

  <p>
    AleoScan is just an explorer. If you have issues with exchanges and / or wallets, please contact them
    directly. AleoScan feedback is NOT a support channel for your issues with them. Those "feedbacks" won't
    be answered.
  </p>
</div>
