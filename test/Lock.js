import { expect } from "chai";
import { ethers } from "hardhat";

describe("DAO Creation Toolkit", function () {
  let DAO: any, dao: any, owner: any, member1: any, member2: any;

  beforeEach(async function () {
    [owner, member1, member2] = await ethers.getSigners();
    DAO = await ethers.getContractFactory("DAO");
    dao = await DAO.deploy();
    await dao.waitForDeployment();
  });

  it("should allow the owner to create a proposal", async function () {
    const tx = await dao.connect(owner).createProposal("Fund open-source");
    await tx.wait();
    const proposal = await dao.proposals(0);
    expect(proposal.description).to.equal("Fund open-source");
  });

  it("should allow members to vote on a proposal", async function () {
    await dao.connect(owner).createProposal("Add new member");
    await dao.connect(member1).vote(0, true);
    await dao.connect(member2).vote(0, false);
    const votes = await dao.getProposalVotes(0);
    expect(votes[0]).to.equal(1); // yes votes
    expect(votes[1]).to.equal(1); // no votes
  });

  it("should execute proposal if majority approves", async function () {
    await dao.connect(owner).createProposal("Distribute funds");
    await dao.connect(member1).vote(0, true);
    await dao.connect(member2).vote(0, true);

    await expect(dao.connect(owner).executeProposal(0))
      .to.emit(dao, "ProposalExecuted")
      .withArgs(0, "Distribute funds");
  });

  it("should prevent double voting", async function () {
    await dao.connect(owner).createProposal("Upgrade DAO rules");
    await dao.connect(member1).vote(0, true);
    await expect(dao.connect(member1).vote(0, true))
      .to.be.revertedWith("Already voted");
  });
});
